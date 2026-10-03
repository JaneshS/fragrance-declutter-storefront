# Setup guide

This sets up your own Fragrance Declutter Storefront. No coding is needed: you'll copy, paste and click. Use a laptop.

**You'll need:** a personal Google (Gmail) account. Work or school Google accounts often block the "Anyone" sharing this needs.

**Time:** about 30 minutes.

---

## 1. Copy the template sheet

1. Open the template link in the [README](../README.md) and click **Make a copy**.
   - If you downloaded the `.xlsx` file instead: upload it to Google Drive, open it, then click **File → Save as Google Sheets** and use that new copy.
2. Rename your copy, e.g. *My Fragrance Declutter*.

The sheet has these tabs. **Don't rename the tabs or their column headings**, because the website looks them up by name.

| Tab | What it's for |
|---|---|
| **Inventory** | One row per decant or bottle. Only rows with Status = **Available** appear on the site. |
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

**Discounts** (columns D–F) are optional. Set a tier's **Active** to **Yes** to switch it on.

## 3. Publish the data link (Apps Script)

This creates a private web link that reads your sheet and hands the data to the website.

1. In your sheet: **Extensions → Apps Script**.
   - If the code from `apps-script/Code.gs` is already there (copies of the template include it), skip to step 2.
   - Otherwise: select everything in the editor, delete it, paste the contents of `apps-script/Code.gs`, and save (Ctrl+S).
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
3. In your new GitHub copy:
   1. Open `index.html` and click the **pencil ✏** (Edit).
   2. Find the line `const DATA_URL = '...';` near the top. Replace the link between the quotes with **your** data link.
   3. Click **Commit changes**.
4. Netlify republishes automatically within a minute.
5. To choose your address: in Netlify, go to **Site configuration → Change site name**, e.g. `my-fragrance-declutter`. Your site will be at `my-fragrance-declutter.netlify.app`.

### Option B: no GitHub (drag and drop)

1. Download `index.html` from this project.
2. Open it in Notepad (Windows) or TextEdit (Mac), replace the `DATA_URL` link with yours, and save.
3. Go to **app.netlify.com/drop**, log in, and drag the `index.html` file onto the page.

To update later, drag the new file onto your site's **Deploys** page.

### Check it

Open your site on your phone:

- Your store name and sample perfumes should appear.
- **Ask a question** and **Send on WhatsApp** should open WhatsApp.
- Mark an item **Sold** in the sheet and reload the page: it disappears.

## 5. Optional: the phone app

To add perfumes, photos and vouches and to mark things sold from your phone, follow [APPSHEET.md](APPSHEET.md).

---

## Adding photos and vouches without the phone app

1. Upload the image to Google Drive. Right-click it → **Share → Copy link**.
2. Add a row on the **Photos** tab (Item ID, the link in **Image**, and **Order**) or on the **Vouches** tab.
3. Leave **Public URL** blank. The script shares the photo and fills this in the first time the site loads.

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
| **A photo shows a grey box on the site** | Wait a minute and reload. Drive can be slow the first time it shares an image. |
| **A photo pasted as a Drive link shows a warning icon in the phone app** | The website handles share links, but AppSheet can't display them. Copy the row's **Public URL** into its **Image** cell, or re-add the photo through the app. |
