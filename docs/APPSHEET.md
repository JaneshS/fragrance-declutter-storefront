# Phone admin app (AppSheet)

This guide sets up a free phone app for running your storefront. With it you can:

- add new perfumes and photos,
- mark items as sold,
- add vouches,

all without opening the spreadsheet. The app edits your Google Sheet directly, so every change shows up on the website the next time a buyer loads the page.

**Time needed:** about 30–40 minutes, once. Use a laptop for the setup and your phone at the end.

**Cost:** free. AppSheet lets the app's creator (and up to 10 testers) use an app for free without "deploying" it, which is all a personal storefront needs.

> **Menus change.** AppSheet occasionally moves buttons around. If something below doesn't match what you see, look for the closest-sounding option. Most settings are found by clicking a table or column and looking for its settings (pencil or gear icon).

---

## Part 1: Create the app

1. Open your storefront Google Sheet.
2. Click **Extensions → AppSheet → Create an app**.
3. Sign in with the **same Google account** that owns the sheet. Allow the permissions it asks for, which let it read and write the sheet and save photos to your Drive.
4. Wait while AppSheet builds a starter app. It opens in the **AppSheet editor**, with a phone preview on the right.

**Check:** the preview shows a list of your perfumes.

---

## Part 2: Add the tables

A "table" in AppSheet is one tab of your sheet.

1. In the left sidebar, click **Data**.
2. You'll probably see **Inventory** already. Click **+** (Add table) and add **Photos**, then **Vouches**, choosing your storefront sheet each time.
3. **Do not add Settings** for now. There's an optional section at the end if you'd like to edit the banner from your phone.

When asked whether the app may **update / add / delete** rows, allow all three for Inventory, Photos and Vouches.

---

## Part 3: Set up the columns

Click a table under **Data** to see its columns. For each column you can change the **Type** and tick boxes like **Key**, **Show**, **Editable**, **Required**. Open a column's pencil icon for more options, such as **Initial value** (the value a new row starts with).

### Inventory

| Column | Type | Settings |
|---|---|---|
| ID | Text | **Key** ✔, Required ✔. Initial value: the formula in *Automatic IDs* below. Editable ✘ |
| Status | Enum | Values: `Available`, `Sold`. Required ✔. Initial value: `"Available"` |
| Category | Enum | Values: `Indian houses`, `Middle Eastern houses`, `Designer/Niche` (spelled exactly like that). Required ✔ |
| Brand | Text | Required ✔. Suggested values: `SORT(UNIQUE(Inventory[Brand]))` |
| Name | Text | Required ✔, **Label** ✔ (so lists show the perfume's name) |
| Price INR | Number | Required ✔ |
| Type | Enum | Values: `Decant`, `Bottle`. Required ✔. Initial value: `"Decant"` |
| Remaining | **Text** | Must be Text, not Number, so you can type `TSM` |
| Size ml | Decimal | Suggested values: `LIST(2, 3, 5, 10)` (edit to the sizes you use) |
| Inspired By | Text | Leave blank for originals. Suggested values: `SORT(UNIQUE(Inventory[Inspired By]))` |
| Scent Family | Enum | Values: `Fresh`, `Gourmand`, `Aromatic`, `Woody`, `Floral`. Tick **Allow other values** |
| Notes | LongText | — |
| Fragrantica URL | Url | — |
| Inspiration Fragrantica URL | Url | — |
| Date Listed | Date | Initial value: `TODAY()` |

#### Automatic IDs (P001, P002, P003…)

New perfumes get the next number automatically, so you never type an ID.

1. In **Data → Inventory**, add a **virtual column**:
   - Name: `ID number`
   - Type: **Number**
   - Formula: `NUMBER(MID([ID], 2, 10))`

   This reads the number part of each ID (P014 → 14).
2. Set the **ID** column's **Initial value** to:

   ```
   CONCATENATE("P", RIGHT(CONCATENATE("000", MAX(Inventory[ID number]) + 1), 3))
   ```

3. Set **ID** to **Editable ✘**, so it can't be changed by accident. Keep **Show ✔** so you can see it.

Notes:

- **Format:** IDs look like `P001`. The letter can be anything you like (change `"P"` in the formula), but it must be a single letter followed by digits.
- **Deleted rows:** if you delete a row, its number isn't reused. That's intended: an ID is never given to a different perfume.
- **Adding rows in the spreadsheet itself:** type the next ID by hand, or drag the cell above down to continue the series.
- **After P999:** change the `3` at the end of the formula to `4`.

The **Text** suggestions on Brand and Inspired By show your existing values as you type, so you can tap "Lattafa" instead of typing it. New values are still allowed.

### Photos

| Column | Type | Settings |
|---|---|---|
| Photo ID | Text | **Key** ✔. Initial value: `UNIQUEID()`. **Show** ✘ (hidden) |
| Item ID | **Ref** | Source table: **Inventory**. Required ✔. Tick **Is a part of**. Key ✘, Label ✘ |
| Image | Image | Required ✔ |
| Order | Number | Initial value: `COUNT(SELECT(Photos[Photo ID], [Item ID] = [_THISROW].[Item ID])) + 1` |
| Public URL | Text | **Show** ✘, **Editable** ✘ (the website fills this in itself) |

Making **Item ID** a Ref to Inventory does something useful. Each perfume's detail screen gets a **Related Photos** section with an **Add** button, so you add photos *from the perfume itself* and never type an ID. "Is a part of" keeps a perfume's photos together with it.

**Order:** `1` is the cover photo. The formula numbers new photos 1, 2, 3… automatically. To make a different photo the cover, edit the numbers.

### Vouches

| Column | Type | Settings |
|---|---|---|
| Vouch ID | Text | **Key** ✔. Initial value: `UNIQUEID()`. **Show** ✘ |
| Image | Image | Required ✔ |
| Caption | Text | Optional, e.g. `Pune, Lattafa set` |
| Date | Date | Initial value: `TODAY()` |
| Show | Enum | Values: `Yes`, `No`. Initial value: `"Yes"` |
| Public URL | Text | **Show** ✘, **Editable** ✘ |

Click **Save** (top right) after each table.

**Only one Key per table:** the ID column (`ID`, `Photo ID` or `Vouch ID`). If AppSheet has ticked Key on any other column, untick it.

**Check each table's permissions:**

1. Open the table under **Data**.
2. Click the table settings icon (top right of the table, a database symbol with a small gear).
3. Under **Are updates allowed?**, make sure **Updates**, **Adds** and **Deletes** are all on.

---

## Part 4: A photo count, so un-photographed items come first

1. Open **Data → Inventory** and click **+ Add virtual column** (or **Add column → Virtual**).
2. Name it `Photo count`, type **Number**, formula: `COUNT(SELECT(Photos[Photo ID], [Item ID] = [_THISROW].[ID]))`.
3. Save.

---

## Part 5: The "Available" list

**Make a slice** (a filtered version of a table):

1. Under **Data → Inventory**, find **Slices** and click **+ Add slice**.
2. Name it `Available items`.
3. Row filter condition: `[Status] = "Available"`
4. Save.

**Make it the home screen:**

1. In the left sidebar, click **Views**, then **+ New view**.
2. Set it up:
   - **Name:** `Available`
   - **For this data:** `Available items` (the slice)
   - **View type:** **Table** or **Deck**, whichever you prefer
   - **Position:** **first**
   - **Sort by:** `Photo count` ascending, then `Date Listed` descending

   Items with no photos now sit at the top, as a reminder to photograph them.
3. Also add:
   - **`Vouches`** view: data **Vouches**, type **Gallery**, position **next**.
   - Optionally, **`All items`**: data **Inventory**, type **Table**, position **menu**. Sold items will be easy to find here if you ever need to un-sell one.
4. If AppSheet created extra views you don't need (like a separate "Photos" view), set their position to **ref** to hide them from the bottom bar.

---

## Part 6: The "Mark sold" button

1. In the left sidebar, click **Actions**, then **+ New action**.
2. Set it up:
   - **Action name:** `Mark sold`
   - **For a record of this table:** `Inventory`
   - **Do this:** `Data: set the values of some columns in this row`
   - **Set these columns:** `Status` = `"Sold"`
   - **Only if this condition is true:** `[Status] = "Available"`
   - **Appearance:** pick an icon (e.g. a tag or check). Display: **Display prominently**.
   - **Needs confirmation?** ✔, with the message `Mark this as sold? It will disappear from the website.`
3. Save.

**Optional undo button:** make a second action, `Mark available`, that sets `Status` = `"Available"` only if `[Status] = "Sold"`.

**Optional "Duplicate" button**, handy when listing several decants of the same perfume:

1. Make an action called `Duplicate` for Inventory.
2. Do this: `App: copy this row and edit the copy`.
3. Display it prominently.

The copy opens with everything filled in. Change the fill level, then save. Check that the copy got a **new** ID. If it shows the same one, saving will be refused with a duplicate-key message, and you can let me know.

---

## Part 7: Put it on your phone

1. Install **AppSheet** from the Play Store or App Store.
2. Sign in with the same Google account.
3. Your app appears in the list. Open it.

You don't need to press "Deploy". Leaving the app in prototype mode is fine for personal use.

---

## Part 8: Test the whole loop

1. **Add an item:** in the app, tap **+** and add a test perfume (e.g. ID `T001`, Available), then save.
2. **Add photos:** open the item, scroll to **Related Photos**, tap **Add**, and take or choose 2 photos.
3. **Check the website:** wait for the app to finish syncing (the spinning icon stops), then reload the website. `T001` should appear with a camera icon and **2**. The first load after adding photos can take a few seconds longer, because the script is sharing the new photos.
4. **Mark sold:** tap **Mark sold** on `T001` and confirm. Reload the website: it's gone.
5. **Add a vouch:** in the **Vouches** tab, add a screenshot. Reload the website and open **See vouches**.
6. **Clean up:** delete the `T001` test row in the sheet (or leave it as Sold).

---

## Tips

- **Blur buyer details** on vouch screenshots before uploading. Your phone's photo editor has a markup or blur tool.
- **Replacing a photo:** delete the photo row and add a new one, rather than swapping the image inside an existing row.
- **Photos are stored** in your Google Drive, in a folder AppSheet creates called `appsheet/data/<your app name>…/Photos_Images` (and `Vouches_Images`). The website only shares those specific files ("anyone with the link can view"). Nothing else in your Drive is shared.
- **Not showing on the website?** In the app, tap the sync icon to make sure your changes were saved. Then check the row in the sheet itself.

---

## Optional: edit the banner from your phone

1. **Data → +** → add the **Settings** table. Allow **updates only** (no adds or deletes).
2. Set **Setting** as the **Key**, and set **Editable** ✘ on it, so names can't be changed by accident.
3. Add a **Table** view for Settings with position **menu**.

**Important:** in AppSheet, only edit the **Value** column of the rows on the left, such as Banner and Tagline. The Discounts and Scent families tables sit in other columns of the same tab and are best edited in the spreadsheet.
