# Testing Guide

## Quick Test (5 minutes)

### 1. Load Extension
```bash
npm install
npm run build
```
Then load `dist/` folder in Chrome at `chrome://extensions/`

### 2. Test Burial
1. Click extension icon
2. Enter `example.com`
3. Set to 1 day
4. Click "Bury Website"
5. Watch the coffin animation

### 3. Test Blocking
1. Navigate to `https://example.com`
2. Should see horror block screen
3. Horror GIF should be playing in background
4. Two buttons should appear

### 4. Test Penance (Fast)
For testing, you can modify the duration:

Edit `components/Penance.tsx`:
```typescript
const DURATION = 10; // 10 seconds instead of 3600
```

Then rebuild and test:
1. Click "Challenge the Void"
2. Wait 10 seconds
3. Should redirect to example.com

## Full Test (1+ hour)

### Test Real Penance
1. Don't modify the duration
2. Start penance
3. Verify:
   - Timer counts down from 1:00:00
   - Horror GIFs rotate every 15 seconds
   - Creepy messages appear randomly
   - Closing window resets timer
   - After 1 hour, redirects to site

### Test Multiple Sites
1. Bury `youtube.com` for 7 days
2. Bury `reddit.com` for 30 days
3. Bury `twitter.com` for 1 day
4. Verify all show in graveyard
5. Try visiting each - all should block

### Test Temporary Unlock
1. Complete penance for a site
2. Verify you can access it
3. Wait 10 minutes
4. Try again - should be blocked

### Test Attempt Tracking
1. Try visiting a buried site 5 times
2. Check extension popup
3. Should show "5 FAILED ATTEMPTS"

## Edge Cases

### Test URL Variations
Bury `youtube.com`, then try:
- `https://youtube.com`
- `https://www.youtube.com`
- `https://youtube.com/watch?v=123`
- `https://m.youtube.com`

All should be blocked.

### Test Subdomain Matching
Bury `reddit.com`, then try:
- `https://old.reddit.com`
- `https://www.reddit.com`
- `https://reddit.com/r/programming`

All should be blocked.

### Test Non-Matching
Bury `facebook.com`, then try:
- `https://twitter.com` - Should NOT block
- `https://instagram.com` - Should NOT block

### Test Expiration
1. Bury a site for 1 minute (modify code)
2. Wait 1 minute
3. Try visiting - should show "UNSEALED" option
4. Click to resurrect

## Browser Compatibility

### Chrome
- ✅ Should work perfectly
- Test on Chrome 120+

### Edge
- ✅ Should work (Chromium-based)
- Load as unpacked extension

### Firefox
- ❌ Needs manifest v2 conversion
- Not currently supported

### Brave
- ✅ Should work (Chromium-based)
- May need to allow extension permissions

## Performance Tests

### Memory Usage
1. Open Chrome Task Manager (Shift+Esc)
2. Find "SkinnerBox" process
3. Should use < 50MB RAM

### CPU Usage
1. Start penance screen
2. Check CPU usage
3. Should be < 5% CPU

### Storage Usage
1. Bury 100 sites
2. Check `chrome://extensions/` → SkinnerBox → Storage
3. Should be < 1MB

## Debugging

### Enable Console Logs
Add to `background.js`:
```javascript
console.log('Checking URL:', url);
console.log('Buried sites:', sites);
console.log('Blocking:', buriedSite.name);
```

### Check Storage
In extension popup, open DevTools (F12):
```javascript
chrome.storage.local.get(null, console.log);
```

### Test Background Worker
Go to `chrome://extensions/` → SkinnerBox → "service worker" link
Check console for errors

### Clear All Data
```javascript
chrome.storage.local.clear();
localStorage.clear();
```

## Common Issues

### "Extension not blocking"
- Check permissions in manifest
- Verify background worker is running
- Check URL matching logic
- Reload extension

### "Horror GIFs not loading"
- Check internet connection
- Try different GIF URLs
- Check browser console for CORS errors
- Some networks block Giphy

### "Timer not working"
- Don't close the window
- Check if tab is active
- Verify JavaScript is enabled

### "Can't load extension"
- Check manifest.json syntax
- Verify all files in dist/
- Check Chrome version (need 120+)
- Try removing and re-adding

## Automated Testing (Future)

Could add:
- Jest for unit tests
- Playwright for E2E tests
- Chrome extension testing framework

Example test structure:
```typescript
describe('SkinnerBox', () => {
  test('should bury a site', () => {
    // Test burial logic
  });
  
  test('should block buried sites', () => {
    // Test blocking logic
  });
  
  test('should grant temp access after penance', () => {
    // Test penance completion
  });
});
```

## Test Checklist

- [ ] Extension loads without errors
- [ ] Can bury a website
- [ ] Burial ritual animation plays
- [ ] Site appears in graveyard
- [ ] Visiting buried site shows horror screen
- [ ] Horror GIFs load and rotate
- [ ] Penance timer counts down
- [ ] Completing penance grants access
- [ ] Temporary access expires after 10 minutes
- [ ] Attempt counter increments
- [ ] Multiple sites can be buried
- [ ] Sites can be excavated after expiration
- [ ] Extension persists after browser restart
- [ ] Works in incognito (if enabled)
- [ ] No console errors
- [ ] Reasonable performance

## Reporting Issues

If you find bugs:
1. Check console for errors
2. Note exact steps to reproduce
3. Include Chrome version
4. Include extension version
5. Check if it happens in incognito
6. Try with fresh install

## Success Criteria

Extension is working if:
- ✅ Blocks sites reliably
- ✅ Horror animations play
- ✅ Penance system works
- ✅ No crashes or freezes
- ✅ Data persists correctly
- ✅ Performance is acceptable
