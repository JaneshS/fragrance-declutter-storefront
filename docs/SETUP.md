# Setup guide

This sets up your own Fragrance Declutter Storefront. No coding is needed: you'll copy, paste and click. Use a laptop.

**You'll need:** a personal Google (Gmail) account. Work or school Google accounts often block the "Anyone" sharing this needs.

**Time:** about 30 minutes for the shop. The optional extras at the end take 5 to 15 minutes each.

---

## 1. Copy the template sheet

1. Download [`template/Fragrance_Declutter_Storefront_Template.xlsx`](../template/Fragrance_Declutter_Storefront_Template.xlsx).
2. Upload it to Google Drive and open it.
3. Click **File → Save as Google Sheets**. Use this new Google Sheets copy from now on (you can delete the uploaded `.xlsx`).
4. Rename it, e.g. *My Fragrance Declutter*.

The sheet has these tabs. **Don't rename the tabs or their column headings**, because the website looks them up by name.

| Tab | What it's for |
|---|---|
| **Inventory** | One row per decant or bottle. Only rows with Status = **Available** appear on the site. **Sold** and **Draft** rows stay hidden, so use Draft for items you're still filling in. |
| **Photos** | Product photos, linked to an Inventory ID. Order 1 is the cover photo. |
| **Vouches** | Thank-you screenshots from buyers. Blur names and numbers first. |
| **Settings** | Store name, tagline, WhatsApp number, banner, minimum order, free-shipping amount, discounts, scent families. |
| **How to use** | Explains every column. |

The six sample perfumes are there so you can test. Replace them with your own later.

## 2. Fill in Settings

On the **Settings** tab, change the values in column **B**:

| Setting | What to enter |
|---|---|
| **Store name** and **Tagline** | Shown at the top of the site. |
| **WhatsApp number** | Country code + number, digits only, no `+` or spaces. Example: `919876543210`. |
| **Banner** | An announcement strip. Clear it to hide the banner. |
| **Minimum order** and **Free shipping from** | In rupees. Buyers see friendly warnings below these amounts; orders are never blocked. |
| **New badge days** | How many days an item counts as NEW. |
| **Delivery note** | Shown in the footer. |
| **Credit line** | Shown in the footer. |
| **Sheet link** | Optional. Leave blank for now. See [Optional: Google Sheet view for buyers](#optional-google-sheet-view-for-buyers). |

**Discounts** (columns D–F) are optional. Set a tier's **Active** to **Yes** to switch it on.

## 3. Publish the data link (Apps Script)

This creates a private web link that reads your sheet and hands the data to the website.

1. In your sheet: **Extensions → Apps Script**. Select everything in the editor, delete it, paste the contents of [`apps-script/Code.gs`](../apps-script/Code.gs), and save (Ctrl+S).
2. In the toolbar dropdown next to **Debug**, choose **testOutput**, then click **Run**.
3. Google asks for permission. Click **Review permissions** and choose your account. On **"Google hasn't verified this app"**, click **Advanced → Go to … (unsafe)**, then **Allow**. It says this because it's your own script, not a published app.
4. The **Execution log** should show your data as text starting with `{`.
5. Click **Deploy → New deployment**, then the gear icon ⚙ → **Web app**:
   - **Execute as:** Me
   - **Who has access:** **Anyone**
6. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`). This is your **data link**.
7. **Test:** open the link in a private/incognito window. You should see your data as plain text.

**Changing the code later?** Use **Deploy → Manage deployments → ✏ → Version: New version → Deploy**. This keeps the same link. ("New deployment" creates a different link.)

## 4. Put the website online (Netlify)

### Option A: Deploy to Netlify button (recommended)

1. Click **Deploy to Netlify** in the README.
2. Sign up or log in with GitHub. Netlify creates your own copy of this project and publishes it.
3. To choose your address: in Netlify, go to **Site configuration → Change site name**, e.g. `my-fragrance-declutter`. Your site will be at `my-fragrance-declutter.netlify.app`.
4. In your new GitHub copy, edit two files. For each one, open it, click the **pencil ✏** (Edit), make the change, then click **Commit changes**:
   - **`index.html`:** find `const DATA_URL = '...';` near the top and replace the link between the quotes with **your** data link.
   - **`post.html`:** make the same `DATA_URL` change, and set `const SITE_URL = '...';` to your site address from step 3 (e.g. `https://my-fragrance-declutter.netlify.app`).
5. Netlify republishes automatically within a minute.

### Option B: no GitHub (drag and drop)

1. Download `index.html` and `post.html` from this project into a new folder.
2. Open each in Notepad (Windows) or TextEdit (Mac, choose **Format → Make Plain Text** first):
   - In both files, replace the `DATA_URL` link with yours.
   - In `post.html`, also set `SITE_URL` to your site address. You'll know it after step 3, so you can come back and do this.
3. Go to **app.netlify.com/drop**, log in, and drag the **whole folder** onto the page.

To update later, drag the folder onto your site's **Deploys** page.

### Check it

Open your site on your phone:

- Your store name and sample perfumes should appear.
- **Ask a question** and **Send on WhatsApp** should open WhatsApp.
- Mark an item **Sold** in the sheet and reload the page: it disappears.
- Open `your-site/post`: the Post Builder should list your Available items.

Your shop is live. Everything below is optional.

---

## Optional: the phone app

To add perfumes, photos and vouches and to mark things sold from your phone, follow [APPSHEET.md](APPSHEET.md).

## Adding photos and vouches without the phone app

1. Upload the image to Google Drive. Right-click it → **Share → Copy link**.
2. Add a row on the **Photos** tab (Item ID, the link in **Image**, and **Order**) or on the **Vouches** tab.
3. Leave **Public URL** blank. The script shares the photo and fills this in the first time the site loads.

## Optional: price drops (sale prices)

To discount something that isn't selling, type the new price in its **Sale Price** column on the Inventory tab. Leave **Price** as it was. The site then:

- strikes through the old price and shows the sale price, with a **-20%**-style badge,
- shows a **Sale** filter button next to **New**, so buyers can see only price drops,
- uses the sale price in the cart and the WhatsApp order message.

The Post Builder shows it too: struck-through prices in the message (WhatsApp shows `~Rs. 300~` as crossed out) and a red price tag in bottle collages.

To end a sale, clear the **Sale Price** cell. A sale price that isn't lower than Price is ignored.

**Set up before this feature existed?** Add a column headed `Sale Price` to your Inventory tab (anywhere after the existing columns), then update the script: paste the latest [`apps-script/Code.gs`](../apps-script/Code.gs) into Extensions → Apps Script, save, and publish it with **Deploy → Manage deployments → ✏ → Version: New version → Deploy**.

## Optional: Google Sheet view for buyers

Some buyers prefer a plain spreadsheet. This makes a separate, view-only Google Sheet that always shows your Available items, so there's nothing to keep in sync, and adds a **Google Sheet** button next to Table and Photos on the site.

1. Create a new, blank Google Sheet, e.g. *My Fragrance Declutter: Available list*.
2. Rename the first tab to `Available`.
3. Copy your shop sheet's ID: it's the long code in its web address, between `/d/` and `/edit`.
4. In cell **A1** of the new sheet, paste this formula, replacing `YOUR-SHEET-ID`:

   ```
   =QUERY(IMPORTRANGE("YOUR-SHEET-ID","Inventory!A1:P"),"select Col1, Col4, Col5, Col7, Col8, Col9, Col6, Col16, Col10, Col11, Col3, Col12, Col13 where Col2 = 'Available' order by Col7, Col4, Col5 label Col1 'ID', Col4 'Brand', Col5 'Fragrance', Col7 'Type', Col8 'Remaining', Col9 'Bottle size', Col6 'Price (Rs.)', Col16 'Sale price (Rs.)', Col10 'Inspired by', Col11 'Scent family', Col3 'Category', Col12 'Notes', Col13 'Fragrantica'",1)
   ```

5. Cell A1 shows `#REF!`. Hover over it and click **Allow access**. Your list appears.
6. Optional: add a second tab with your ordering terms, payment method and a link to your site.
7. Click **Share → General access → Anyone with the link → Viewer**, and copy the link.
8. Paste the link into **Sheet link** on your shop sheet's **Settings** tab. Reload the site: the **Google Sheet** button appears.

Sold items drop off this list automatically. Draft items never appear.

## Optional: Post Builder (for your group and Reddit posts)

Open `your-site/post` (for example `my-fragrance-declutter.netlify.app/post`). It's for you, not buyers: it isn't linked from the shop and hidden from search engines, though anyone with the address can open it.

1. **Pick fragrances.** Search, or tap **New** to show only recent listings, then **Pick all shown** to select them all.
2. **Deals and combos (optional).** Type anything you're offering in this post only. It goes into the message as written and doesn't change your site.
3. **Message.** Builds itself from your picks: name, fill level, inspiration, price, your minimum order and shipping terms, and your site link. You can edit it and tap **Copy message**.
4. **Download folder.** You get a zip containing:

   - `collage.jpg`: each bottle with its first two photos side by side (front and back, from the **Order** column in Photos), name and price. More than 4 bottles are split across `collage-1.jpg`, `collage-2.jpg` and so on.
   - Decants (Type = Decant) get their own collage: one photo each in a numbered grid (no captions), up to 16 per image. The numbers match the list in the message. If you pick bottles and decants together, you get `collage-bottles…` and `collage-decants…` files.
   - `photos/`: every photo on its own, numbered and named `front` or `back`.
   - `message.txt`: the post text.

**Photo tips:** for bottles, add a front photo as Order 1 and a back photo as Order 2. For decants, one photo showing the label and fill level is enough. Collages crop each photo slightly toward the bottom so labels stay in view.

## Troubleshooting

| Problem | Fix |
|---|---|
| **"Access blocked: Authorization Error … OAuth client is not fully created yet"** when giving permission | Google is still setting up your new script. Wait 10 minutes, refresh the Apps Script page, and run **testOutput** again. If it still fails after 30 minutes, make a copy of the sheet (File → Make a copy) and use the copy's script. |
| **Run finishes but the log shows no data** | The dropdown next to Debug says **doGet**. Choose **testOutput** instead. |
| **Incognito asks you to sign in** when opening the data link | **Who has access** isn't set to **Anyone**. Go to Deploy → Manage deployments → ✏, fix it, and click Deploy. |
| **"Anyone" isn't offered as an option** | You're using a work or school Google account. Use a personal Gmail account. |
| **Site says "The collection couldn't load"** | Check that the `DATA_URL` link is complete, ends in `/exec`, and is still inside the quotes. Confirm the link shows data in an incognito window. |
| **Script changes don't show up** | You need to publish a **New version** (see the end of section 3). |
| **You accidentally made a second deployment** | Either deployment works, but only the newest has your latest code. Put the newest link in `DATA_URL`, then archive the old one in Deploy → Manage deployments. |
| **New items don't show under New** | Fill in **Date Listed** (format `2026-10-03`). Items without a date are still listed, just never marked New. |
| **The Google Sheet button doesn't appear** | Check **Sheet link** on the Settings tab, then reload the site. |
| **The buyer sheet asks people to request access** | In that sheet, set **Share → General access** to **Anyone with the link: Viewer**. |
| **A photo shows a grey box on the site** | Wait a minute and reload. Drive can be slow the first time it shares an image. |
| **A photo pasted as a Drive link shows a warning icon in the phone app** | The website handles share links, but AppSheet can't display them. Copy the row's **Public URL** into its **Image** cell, or re-add the photo through the app. |
