# Installation Guide

## Step 1: Build the Extension

```bash
npm install
npm run build
```

This will create a `dist` folder with your extension files.

## Step 2: Load into Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" button
5. Select the `dist` folder from this project
6. The extension icon should appear in your Chrome toolbar

## Step 3: Start Using

1. Click the extension icon to open the control panel
2. Enter a website domain you want to block (e.g., `instagram.com`)
3. Choose how many days to bury it (1-365 days)
4. Click "Bury Website" and watch the ritual
5. Try to visit that website - you'll be blocked with horror animations!

## How to Unbury Early

If you absolutely need to access a buried site:

1. Try to visit the blocked website
2. You'll see the horror block screen
3. Click "Challenge the Void"
4. Watch 1 HOUR of horror animations (don't close the window!)
5. After completion, you get 10 minutes of access
6. After 10 minutes, it's blocked again

## Troubleshooting

**Extension not blocking sites:**
- Make sure the extension has permissions for `<all_urls>`
- Check that the domain name matches (e.g., use `youtube.com` not `www.youtube.com`)
- Reload the extension from `chrome://extensions/`

**Horror animations not loading:**
- Check your internet connection
- The extension uses external GIF sources from Giphy
- Some corporate networks may block these

**Timer not working:**
- Don't close the penance window
- Keep the tab active
- The timer resets if you navigate away

## Tips

- Use just the domain name without `http://` or `www.`
- The extension blocks ALL pages containing that domain
- You can bury multiple sites at once
- The burial period persists even if you close Chrome
- To remove a site permanently, wait for the burial period to expire

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "SkinnerBox - Horror Website Blocker"
3. Click "Remove"
4. All buried sites data will be cleared
