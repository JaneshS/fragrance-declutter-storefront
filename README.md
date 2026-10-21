# Fragrance Declutter Storefront

A free, mobile-first web shop for selling your personal fragrance decants and bottles, run entirely from a Google Sheet.

Buyers browse your collection, add items to a cart and tap **Send on WhatsApp**: their order arrives in your WhatsApp as a ready-made message. Payment and delivery are arranged in the chat, the way declutter groups already work.

**Costs nothing to run.** No coding needed to set up. Built for sellers in WhatsApp and Reddit fragrance declutter communities.

## What buyers get

- **Search:** by brand, name or the fragrance it's inspired by, with live suggestions.
- **Browsing:** by Indian houses, Middle Eastern houses or Designer/Niche.
- **Filters:** new arrivals, decants vs bottles, brand, price, originals vs inspired, and scent family.
- **Three ways to view the list:**
  - **Table:** expand any perfume for your notes, Fragrantica links and photos.
  - **Photos:** a photo grid with a full-screen viewer (pinch to zoom, swipe between photos).
  - **Google Sheet** (optional): opens a plain, view-only spreadsheet of what's available, for buyers who prefer a list.
- **See vouches:** a gallery of thank-you messages from past buyers.
- **Price drops:** discounted items show the old price struck through, a % off badge, and a **Sale** filter.
- **Cart:** minimum-order, shipping and discount notes. Before sending, the cart re-checks availability, so nobody orders something that has just sold.
- **Comfortable on any device:** light and dark mode, and a desktop layout with a side cart.

## What you (the seller) get

- **One Google Sheet runs everything:** inventory, photos, vouches, store settings and discounts.
- **Instant updates:** mark an item Sold and it disappears from the site straight away. Rows marked **Draft** stay hidden until you're ready.
- **A free phone app (AppSheet), optional:** add perfumes, take photos, add vouches and mark items sold without opening the sheet.
- **Post Builder, a private page for promoting your declutters:** pick the fragrances you want to feature and download one folder containing:
  - collages sized for WhatsApp and Reddit (front and back photos for bottles, a numbered grid for decants),
  - every photo on its own,
  - a ready-to-paste message with prices, your terms and any deals you type in.

## What it doesn't do

- **No online payments.** Buyers send their order on WhatsApp, and you share UPI or other payment details in the chat.
- **No shipping or tracking.** You book courier pickups yourself.
- **No stock counts.** Each row is one physical item: it's either Available or Sold.
- **No buyer accounts or order history.** Orders live in your WhatsApp chats.
- **No posting for you.** The Post Builder prepares images and text; you post them to your groups.

## How it works

```
Google Sheet  ──>  Apps Script (free data link)  ──>  index.html + post.html on Netlify (free hosting)
     ^
AppSheet phone app (optional)
```

## Set up your own shop

1. **Copy the template sheet:** download [`template/Fragrance_Declutter_Storefront_Template.xlsx`](template/Fragrance_Declutter_Storefront_Template.xlsx) and open it in Google Sheets.
2. **Fill in the Settings tab:** store name, WhatsApp number, banner and so on.
3. **Publish the data link** from the sheet (Extensions → Apps Script → Deploy).
4. **Put the site online:** click the button below, then paste your data link into `index.html` and `post.html`.

   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/JaneshS/fragrance-declutter-storefront)

5. **Optional extras:** the phone app, the Google Sheet view for buyers, and the Post Builder.

**Step-by-step guides, written for non-developers:**

- [docs/SETUP.md](docs/SETUP.md): sheet, data link, website and the optional extras (about 30 minutes)
- [docs/APPSHEET.md](docs/APPSHEET.md): phone admin app (about 40 minutes)

## Files

| File | What it is |
|---|---|
| `index.html` | The shop. The only line you change is `DATA_URL` near the top. |
| `post.html` | The Post Builder (open it at `your-site/post`). Change `DATA_URL` and `SITE_URL` at the top. |
| `apps-script/Code.gs` | The script that turns your sheet into data for the website. |
| `docs/` | Setup guides. |
| `template/` | The template sheet as an Excel file. |
| `netlify.toml` | Hosting settings (no build step). |

## Credits

Built with Claude by Janesh S. Free to use and adapt under the [MIT License](LICENSE). If you set up your own shop with it, keeping the footer credit is appreciated.
