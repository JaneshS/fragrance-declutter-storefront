/**
 * Fragrance Declutter Storefront: data API (Google Apps Script web app)
 * MIT License
 *
 * Returns the store's live data as JSON:
 *   <web app URL>            -> { settings, discounts, items[] (with photos[]), vouches[] }
 *   <web app URL>?ids=A,B,C  -> { items[] still available, unavailable[] } (cart re-check)
 *
 * Only items with Status = Available are returned. Nothing is cached, so an
 * item marked Sold disappears from the site as soon as the page reloads.
 *
 * Setup: see docs/SETUP.md. You should not need to edit anything below.
 */

var TABS = { inventory: 'Inventory', photos: 'Photos', settings: 'Settings', vouches: 'Vouches' };
var PHOTO_SIZE_FULL = 1600;   // pixels wide for the photo viewer
var PHOTO_SIZE_THUMB = 600;   // pixels wide for cards and strips

/* ---------- Web app entry point ---------- */

function doGet(e) {
  var out;
  try {
    var idsParam = e && e.parameter && e.parameter.ids;
    var ids = idsParam
      ? String(idsParam).split(',').map(function (s) { return s.trim(); }).filter(String)
      : null;
    out = buildData_(ids);
  } catch (err) {
    out = { error: String((err && err.message) || err) };
  }
  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Run this from the editor to test and to grant permissions. */
function testOutput() {
  Logger.log(JSON.stringify(buildData_(null), null, 2));
}

/* ---------- Build the response ---------- */

function buildData_(ids) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var items = readItems_(ss);

  if (ids) {
    // Cart re-check: which of these IDs are still available?
    var availableIds = {};
    items.forEach(function (it) { availableIds[it.id] = true; });
    return {
      checkedAt: new Date().toISOString(),
      items: items.filter(function (it) { return ids.indexOf(it.id) !== -1; }),
      unavailable: ids.filter(function (id) { return !availableIds[id]; })
    };
  }

  var photos = readPhotos_(ss);
  items.forEach(function (it) { it.photos = photos[it.id] || []; });
  var s = readSettings_(ss);
  var vouches = [];
  try { vouches = readVouches_(ss); } catch (err) { /* never let vouches break the shop */ }
  return {
    generatedAt: new Date().toISOString(),
    settings: s.settings,
    discounts: s.discounts,
    items: items,
    vouches: vouches
  };
}

/* ---------- Inventory ---------- */

function readItems_(ss) {
  var rows = readTable_(ss, TABS.inventory).rows;
  var tz = ss.getSpreadsheetTimeZone();
  var items = [];
  rows.forEach(function (r) {
    var id = text_(r.id);
    if (!id) return;
    if (String(r.status || '').trim().toLowerCase() !== 'available') return;
    items.push({
      id: id,
      category: text_(r.category),
      brand: text_(r.brand),
      name: text_(r.name),
      price: number_(r.priceinr),
      type: text_(r.type),
      remaining: remaining_(r.remaining),
      sizeMl: number_(r.sizeml),
      inspiredBy: text_(r.inspiredby),
      scentFamily: text_(r.scentfamily),
      notes: text_(r.notes),
      fragranticaUrl: text_(r.fragranticaurl),
      inspirationFragranticaUrl: text_(r.inspirationfragranticaurl),
      dateListed: date_(r.datelisted, tz)
    });
  });
  return items;
}

/* ---------- Photos ---------- */

function readPhotos_(ss) {
  var table = readTable_(ss, TABS.photos);
  var sheet = table.sheet;
  var urlCol = table.headers.indexOf('publicurl');
  var byItem = {};

  table.rows.forEach(function (r, i) {
    var itemId = text_(r.itemid);
    if (!itemId) return;
    var url = text_(r.publicurl);
    if (!url) {
      url = resolveImage_(r.image);
      // Save it so the Drive lookup only happens once per photo.
      if (url && urlCol !== -1) sheet.getRange(i + 2, urlCol + 1).setValue(url);
    }
    if (!url) return;
    (byItem[itemId] = byItem[itemId] || []).push({
      order: number_(r.order) || 999,
      full: sized_(url, PHOTO_SIZE_FULL),
      thumb: sized_(url, PHOTO_SIZE_THUMB)
    });
  });

  Object.keys(byItem).forEach(function (k) {
    byItem[k].sort(function (a, b) { return a.order - b.order; });
    byItem[k] = byItem[k].map(function (p) { return { full: p.full, thumb: p.thumb }; });
  });
  return byItem;
}

/* ---------- Vouches (optional tab) ---------- */

function readVouches_(ss) {
  if (!ss.getSheetByName(TABS.vouches)) return [];
  var table = readTable_(ss, TABS.vouches);
  var sheet = table.sheet;
  var urlCol = table.headers.indexOf('publicurl');
  var tz = ss.getSpreadsheetTimeZone();
  var list = [];

  table.rows.forEach(function (r, i) {
    if (String(r.show || '').trim().toLowerCase() === 'no') return;   // blank or Yes = shown
    var url = text_(r.publicurl);
    if (!url) {
      url = resolveImage_(r.image);
      if (url && urlCol !== -1) sheet.getRange(i + 2, urlCol + 1).setValue(url);
    }
    if (!url) return;
    list.push({
      row: i,
      date: date_(r.date, tz),
      caption: text_(r.caption),
      full: sized_(url, PHOTO_SIZE_FULL),
      thumb: sized_(url, PHOTO_SIZE_THUMB)
    });
  });

  // Newest first: by Date, then rows lower in the sheet first.
  list.sort(function (a, b) {
    if (a.date && b.date && a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return b.row - a.row;
  });
  return list.map(function (v) { return { full: v.full, thumb: v.thumb, caption: v.caption, date: v.date }; });
}

/* Turns an Image cell (AppSheet file path, Drive link, or plain image link)
   into a public image URL, and shares the Drive file as "anyone with link". */
function resolveImage_(value) {
  var v = text_(value);
  if (!v) return null;
  var file = null;
  try {
    if (/^https?:\/\//i.test(v)) {
      var m = v.match(/\/d\/([-\w]{25,})/) || v.match(/[?&]id=([-\w]{25,})/);
      if (!m) return v;                       // an ordinary image link: use as is
      file = DriveApp.getFileById(m[1]);
    } else {
      var name = v.split('/').pop();           // AppSheet stores "Folder/file.jpg"
      var found = DriveApp.getFilesByName(name);
      if (found.hasNext()) file = found.next();
    }
  } catch (err) {
    return null;
  }
  if (!file) return null;                      // not uploaded yet: try again next time
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) { /* sharing may be blocked on some work accounts */ }
  return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w' + PHOTO_SIZE_FULL;
}

function sized_(url, px) {
  return /drive\.google\.com\/thumbnail/.test(url)
    ? url.replace(/([?&]sz=)w\d+/, '$1w' + px)
    : url;
}

/* ---------- Settings, discounts, scent families ---------- */

function readSettings_(ss) {
  var sheet = ss.getSheetByName(TABS.settings);
  if (!sheet) throw new Error('Missing tab: ' + TABS.settings);
  var last = sheet.getLastRow();
  var values = last > 1 ? sheet.getRange(2, 1, last - 1, 8).getValues() : [];
  var numeric = { minimumOrder: 1, freeShippingFrom: 1, newBadgeDays: 1 };

  var settings = {}, discounts = [], scentFamilies = [];
  values.forEach(function (row) {
    // Columns A-B: Setting / Value
    var key = camel_(row[0]);
    if (key) {
      var val = row[1];
      if (key === 'whatsappNumber') val = String(val).replace(/\D/g, '') || null;
      else if (numeric[key]) val = number_(val);
      else val = text_(val);
      settings[key] = val;
    }
    // Columns D-F: Min order / Discount % / Active
    var min = number_(row[3]), pct = number_(row[4]);
    if (min !== null && pct !== null && String(row[5]).trim().toLowerCase() === 'yes') {
      discounts.push({ minOrder: min, percent: pct });
    }
    // Column H: Scent families
    var fam = text_(row[7]);
    if (fam) scentFamilies.push(fam);
  });
  discounts.sort(function (a, b) { return b.minOrder - a.minOrder; });
  settings.scentFamilies = scentFamilies;
  return { settings: settings, discounts: discounts };
}

/* ---------- Helpers ---------- */

function readTable_(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) throw new Error('Missing tab: ' + tabName);
  var values = sheet.getDataRange().getValues();
  var headers = (values[0] || []).map(norm_);
  var rows = values.slice(1).map(function (row) {
    var o = {};
    headers.forEach(function (h, i) { if (h) o[h] = row[i]; });
    return o;
  });
  return { sheet: sheet, headers: headers, rows: rows };
}

function norm_(h) { return String(h || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

function camel_(label) {
  var words = String(label || '').trim().toLowerCase().split(/[^a-z0-9]+/).filter(String);
  if (!words.length) return null;
  return words[0] + words.slice(1).map(function (w) { return w[0].toUpperCase() + w.slice(1); }).join('');
}

function text_(v) {
  if (v === null || v === undefined) return null;
  var s = String(v).trim();
  return s === '' ? null : s;
}

function number_(v) {
  if (typeof v === 'number') return v;
  var s = String(v || '').replace(/[^\d.]/g, '');
  return s === '' ? null : Number(s);
}

function remaining_(v) {
  if (typeof v === 'number') return v;
  var s = text_(v);
  if (!s) return null;
  return /^\d+(\.\d+)?$/.test(s) ? Number(s) : s.toUpperCase();   // e.g. "TSM"
}

function date_(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  return text_(v);
}
