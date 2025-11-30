# How to Reload the Extension (Fix MIME Error)

## The Problem

You're seeing:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script 
but the server responded with a MIME type of "application/octet-stream"
```

**This is a Chrome caching issue!** The extension is built correctly, but Chrome is using the old cached version.

## Solution: Force Chrome to Reload

### Method 1: Remove and Re-add Extension (RECOMMENDED)

1. **Remove the extension:**
   - Go to `chrome://extensions/`
   - Find "SkinnerBox - Horror Website Blocker"
   - Click "Remove" button
   - Confirm removal

2. **Clear Chrome cache (optional but recommended):**
   - Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
   - Select "Cached images and files"
   - Click "Clear data"

3. **Re-add the extension:**
   - Still on `chrome://extensions/`
   - Make sure "Developer mode" is enabled (top right)
   - Click "Load unpacked"
   - Select the `dist` folder
   - Extension loads fresh!

4. **Test it:**
   - Click the extension icon
   - Should open without errors!

### Method 2: Hard Reload (Sometimes Works)

1. Go to `chrome://extensions/`
2. Find "SkinnerBox"
3. Click the reload button (circular arrow icon)
4. **Close all Chrome windows completely**
5. Reopen Chrome
6. Try the extension again

### Method 3: Clear Extension Cache

1. Go to `chrome://extensions/`
2. Find "SkinnerBox"
3. Click "Details"
4. Scroll down to "Site access"
5. Click "Clear storage" (if available)
6. Click the reload button
7. Test again

## Verify the Fix

After reloading, check:

1. **Open extension popup:**
   - Click extension icon
   - Should see control panel
   - No console errors

2. **Check console (F12):**
   - Right-click extension icon → "Inspect popup"
   - Look at Console tab
   - Should be no errors

3. **Test functionality:**
   - Enter `example.com`
   - Set to 1 day
   - Click "Bury Website"
   - Visit `https://example.com`
   - Should see horror block screen

## Why This Happens

Chrome extensions cache files aggressively for performance. When you rebuild:
- The `dist/` folder has new files
- But Chrome still uses old cached files
- Removing and re-adding forces Chrome to load fresh files

## Verify Build is Correct

Before reloading, verify your build is correct:

```bash
# Check HTML has correct script tag
type dist\index.html | findstr "script"
```

Should show:
```html
<script src="./assets/index.js"></script>
```

NOT:
```html
<script type="module" src="./assets/index.js"></script>
```

If it still shows `type="module"`, rebuild:
```bash
npm run build
```

## Still Not Working?

### Check Chrome Version
```
chrome://version/
```
Need Chrome 120 or higher.

### Try Incognito Mode
1. Go to `chrome://extensions/`
2. Find "SkinnerBox"
3. Click "Details"
4. Enable "Allow in incognito"
5. Open incognito window
6. Test extension there

### Check Build Output
```bash
npm run build
```

Should see:
```
✓ 2083 modules transformed.
dist/index.html         2.83 kB
dist/assets/index.js  346.33 kB
✓ built in 11.34s
```

### Check File Exists
```bash
dir dist\assets\index.js
```

Should show a file ~346 KB in size.

## Common Errors After Reload

### "Could not find root element to mount to"

This means the script ran before the DOM was ready. **Fixed in latest build!**

If you still see this:
1. Make sure you ran `npm run build` after the fix
2. Reload the extension
3. The script now waits for DOM to be ready

### Success Indicators

Extension is working when:
- ✅ No console errors
- ✅ Control panel opens
- ✅ Can bury websites
- ✅ Horror screen appears when visiting buried sites
- ✅ GIFs load and play
- ✅ Penance timer works

## Quick Fix Summary

**TL;DR:**
1. Go to `chrome://extensions/`
2. Remove "SkinnerBox"
3. Click "Load unpacked"
4. Select `dist` folder
5. Done!

This forces Chrome to load the new, fixed version instead of using cached files.
