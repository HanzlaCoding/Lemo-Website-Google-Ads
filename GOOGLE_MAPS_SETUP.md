# How to Fix Google Maps Search

The "Search Issue" (Google Maps not loading) is caused by the **API Key Configuration** in your Google Cloud Console. The code on your website is correct, but Google is blocking the request because the key is not fully set up.

## 🚨 IMMEDIATE FIX (Do these 3 Steps)

### Step 1: Enable Billing (Required)
Google Maps Places API **will not work** without a billing account attached, even for the free tier.
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project.
3. Go to **Billing** and link a credit card.
   * *Note: You get $200 free credit every month, so it is usually free for small sites.*

### Step 2: Enable the Right APIs
You must strictly enable **TWO** specific APIs:
1. Go to **APIs & Services > Library**.
2. Search for **"Maps JavaScript API"** -> Click **ENABLE**.
3. Search for **"Places API"** (specifically "Places API", not just "Places Backend") -> Click **ENABLE**.

### Step 3: Fix Key Restrictions (For Testing)
If you are testing this file directly on your computer (e.g., `C:\Users\...`), domain restrictions will block it.
1. Go to **APIs & Services > Credentials**.
2. Click on your API Key (`AIzaSyBx...`).
3. Under **Application restrictions**, set it to **None** (temporarily) to test.
   * *Later, when you publish the site, set it to "HTTP referrers" and add your website domain `www.yourwebsite.com/*`.*

---

## Troubleshooting "This page can't load Google Maps correctly"

If you see this error message box:
1. Open your browser's **Developer Console** (Press `F12` key).
2. Click on the **Console** tab.
3. Look for the red error message from Google. It will tell you the exact reason:
   * `You must enable Billing on the Google Cloud Project` -> **Do Step 1**.
   * `The provided API key is invalid` -> Check if you pasted the key correctly.
   * `RefererNotAllowedMapError` -> **Do Step 3**.
   * `ApiNotActivatedMapError` -> **Do Step 2**.
