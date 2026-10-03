# Fragrance Declutter Storefront

A free, mobile-first web shop for selling your personal fragrance decants and bottles, run entirely from a Google Sheet.

Buyers browse your collection, add items to a cart and tap **Send on WhatsApp**: their order arrives in your WhatsApp as a ready-made message. Payment and delivery are arranged in the chat, the way declutter groups already work.

**Costs nothing to run.** No coding needed to set up. Built for sellers in WhatsApp fragrance declutter communities.

## What buyers get

- **Search:** by brand, name or the fragrance it's inspired by, with live suggestions.
- **Browsing:** by Indian houses, Middle Eastern houses or Designer/Niche.
- **Filters:** new arrivals, decants vs bottles, brand, price, originals vs inspired, and scent family.
- **Table or photo-grid views:** expand any perfume for your notes, Fragrantica links and photos.
- **Full-screen photo viewer:** pinch to zoom, swipe between photos.
- **See vouches:** a gallery of thank-you messages from past buyers.
- **Cart:** minimum-order, shipping and discount notes. Before sending, the cart re-checks availability, so nobody orders something that has just sold.
- **Comfortable on any device:** light and dark mode, and a desktop layout with a side cart.

## What you (the seller) get

- **One Google Sheet runs everything:** inventory, photos, vouches, store settings and discounts.
- **Instant updates:** mark an item Sold and it disappears from the site straight away.
- **A free phone app (AppSheet):** add perfumes, take photos, add vouches and mark items sold, without opening the sheet.

## How it works

```
Google Sheet  ──>  Apps Script (free data link)  ──>  index.html on Netlify (free hosting)
     ^
AppSheet phone app (optional)
```

## Set up your own shop

1. **Copy the template sheet:** [Make a copy of the template](TEMPLATE-SHEET-LINK)
   (or download [`template/Fragrance_Declutter_Storefront_Template.xlsx`](template/Fragrance_Declutter_Storefront_Template.xlsx) and open it in Google Sheets)
2. **Fill in the Settings tab:** store name, WhatsApp number, banner and so on.
3. **Publish the data link** from the sheet (Extensions → Apps Script → Deploy).
4. **Put the site online:** click the button below, then paste your data link into `index.html`.

   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR-GITHUB-USERNAME/fragrance-declutter-storefront)

5. **Optional: set up the phone app.**

**Step-by-step guides, written for non-developers:**

- [docs/SETUP.md](docs/SETUP.md): sheet, data link and website (about 30 minutes)
- [docs/APPSHEET.md](docs/APPSHEET.md): phone admin app (about 40 minutes)

## Files

| File | What it is |
|---|---|
| `index.html` | The whole website. The only line you change is `DATA_URL` near the top. |
| `apps-script/Code.gs` | The script that turns your sheet into data for the website. |
| `docs/` | Setup guides. |
| `template/` | The template sheet as an Excel file. |
| `netlify.toml` | Hosting settings (no build step). |

## Credits

Built with Claude by Janesh S. Free to use and adapt under the [MIT License](LICENSE). If you set up your own shop with it, keeping the footer credit is appreciated.
