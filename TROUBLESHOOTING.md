# Troubleshooting Guide

## CSP (Content Security Policy) Errors - FIXED ✅

The errors you saw were because the extension was trying to load external scripts (Tailwind CDN, Google Fonts) which violates Chrome extension security policies.

### What Was Fixed:
1. **Removed external CDN scripts** - Now using local Tailwind CSS
2. **Added proper CSP to manifest** - Allows only necessary external resources
3. **Bundled all JavaScript** - Everything is compiled into local files
4. **Font loading** - Fonts are loaded via CSS @font-face with proper CSP permissions
5. **Fixed file paths** - Using relative paths (`./assets/`) instead of absolute paths (`/assets/`)

### Current Build:
- ✅ All JavaScript bundled locally
- ✅ CSS compiled with Tailwind
- ✅ Fonts loaded from Google Fonts (allowed in CSP)
- ✅ Horror GIFs from Giphy (allowed in CSP)
- ✅ No inline scripts or eval()
- ✅ Relative paths for Chrome extension compatibility

## MIME Type Error - FIXED ✅

If you saw "Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'application/octet-stream'", this was because:
- The HTML was using absolute paths (`/assets/index.js`)
- Chrome extensions need relative paths (`./assets/index.js`)

**Fixed by:** Adding `base: './'` to `vite.config.ts`

## How to Load the Extension

1. **Build it:**
   ```bash
   npm install
   npm run build
   ```

2. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder
   - Extension should load without errors

3. **Verify it works:**
   - Click the extension icon
   - You should see the SkinnerBox control panel
   - No console errors

## Common Issues After Fix

### Issue: "Failed to load resource: net::ERR_FILE_NOT_FOUND"
**Solution:** Make sure you selected the `dist` folder, not the root folder

### Issue: Extension icon is broken
**Solution:** The icon.png is a placeholder. You can:
- Create a proper icon (128x128 PNG)
- Or ignore it - the extension still works

### Issue: Horror GIFs not loading
**Possible causes:**
- No internet connection
- Corporate firewall blocking Giphy
- Network restrictions

**Solution:** The extension will still block sites, just without the GIF animations

### Issue: Fonts look wrong
**Possible causes:**
- Google Fonts blocked by network
- CSP blocking font loading

**Solution:** Fonts will fallback to system fonts. Extension still works.

## Testing the Extension

### Quick Test:
1. Click extension icon
2. Enter `example.com`
3. Set to 1 day
4. Click "Bury Website"
5. Navigate to `https://example.com`
6. Should see horror block screen

### If Block Screen Doesn't Appear:
1. Check background service worker:
   - Go to `chrome://extensions/`
   - Find SkinnerBox
   - Click "service worker" link
   - Check console for errors

2. Check permissions:
   - Extension needs `<all_urls>` permission
   - Chrome should prompt for this on install

3. Reload extension:
   - Click reload button on extension card
   - Try again

## Development Mode

### Running in Dev Mode:
```bash
npm run dev
```

This starts Vite dev server at `http://localhost:3000`

**Note:** Dev mode is for UI development only. The blocking functionality requires the extension to be loaded in Chrome.

### Making Changes:
1. Edit source files
2. Run `npm run build`
3. Go to `chrome://extensions/`
4. Click reload button on SkinnerBox
5. Test changes

## Debugging

### Enable Console Logs:

**In background.js:**
```javascript
console.log('Checking URL:', url);
console.log('Buried sites:', sites);
```

**In React components:**
```javascript
console.log('Current view:', view);
console.log('Active block:', activeBlock);
```

### Check Storage:
Open extension popup → F12 (DevTools) → Console:
```javascript
chrome.storage.local.get(null, console.log);
```

### Clear All Data:
```javascript
chrome.storage.local.clear();
localStorage.clear();
```

## Performance Issues

### Extension Using Too Much Memory:
- Normal: 30-50MB
- High: 100MB+
- If high, reload the extension

### Horror GIFs Causing Lag:
- This is normal - GIFs are large
- They rotate every 8-15 seconds
- Older computers may struggle

### Penance Timer Freezing:
- Don't minimize the window
- Keep tab active
- Don't switch to other tabs

## Known Limitations

1. **Incognito Mode:** Must be manually enabled
   - Go to `chrome://extensions/`
   - Find SkinnerBox
   - Click "Details"
   - Enable "Allow in incognito"

2. **Other Browsers:** Only works in Chrome/Chromium
   - Edge: Should work
   - Brave: Should work
   - Firefox: Needs manifest v2 conversion

3. **Mobile:** Not supported
   - Chrome mobile doesn't support extensions
   - Would need separate mobile app

4. **Sync:** Doesn't sync across devices
   - Each Chrome installation is independent
   - Could add Chrome sync in future

## Getting Help

### Check These First:
1. Console errors (F12 in extension popup)
2. Background worker errors (`chrome://extensions/` → service worker)
3. Network tab (F12 → Network) for failed requests
4. Extension permissions

### Still Having Issues?
1. Try removing and re-adding the extension
2. Clear Chrome cache
3. Restart Chrome
4. Check Chrome version (need 120+)
5. Try in a fresh Chrome profile

## Success Checklist

Extension is working correctly if:
- ✅ Loads without console errors
- ✅ Can bury a website
- ✅ Burial animation plays
- ✅ Site appears in graveyard
- ✅ Visiting buried site shows horror screen
- ✅ Horror GIFs load (if internet works)
- ✅ Penance timer counts down
- ✅ Data persists after closing Chrome

## Build Errors

### "Module not found"
```bash
rm -rf node_modules
npm install
npm run build
```

### "PostCSS error"
Make sure postcss.config.js uses ES modules:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### "Vite build failed"
Check vite.config.ts is correct:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// ... rest of config
```

## Updating the Extension

After making code changes:
1. `npm run build`
2. Go to `chrome://extensions/`
3. Click reload button on SkinnerBox
4. Test your changes

No need to remove and re-add the extension.
