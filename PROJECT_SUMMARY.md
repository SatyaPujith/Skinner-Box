# SkinnerBox - Horror Website Blocker

## What This Extension Does

SkinnerBox is a Chrome extension that blocks websites using horror-themed psychological deterrents. Unlike simple blockers, it makes accessing blocked sites genuinely unpleasant through:

1. **Burial System**: Block websites for 1-365 days
2. **Automatic Blocking**: Monitors all tabs and redirects to horror page
3. **Horror Animations**: Full-screen horror GIFs from external sources
4. **1-Hour Penance**: Must watch horror for 1 hour to get 10 minutes of access
5. **Attempt Tracking**: Counts how many times you try to break your commitment

## Key Features Implemented

### Frontend (React + TypeScript)
- **Dashboard**: Add sites to bury, view graveyard of buried sites
- **Burial Ritual**: Animated coffin ritual when burying a site
- **Horror Block Screen**: Full-screen horror when trying to access buried sites
- **Penance Screen**: 1-hour timer with rotating horror animations
- **Responsive UI**: Horror-themed design with glitch effects

### Backend (Chrome Extension)
- **Background Service Worker**: Monitors all tab navigation
- **URL Matching**: Intelligent domain matching for blocking
- **Storage System**: Persists buried sites and temporary unlocks
- **Temporary Unlock**: 10-minute access after completing penance
- **Auto-cleanup**: Removes expired temporary unlocks

### Horror Elements
- **External Media**: Uses Giphy horror GIFs (no local storage needed)
- **Rotating Animations**: Changes every 8-15 seconds
- **Creepy Messages**: Random disturbing text appears
- **Glitch Effects**: Visual distortions and flickering
- **Sound Design**: (Can be added - currently silent)

## File Structure

```
skinnerbox/
├── components/
│   ├── Coffin.tsx          # Burial ritual animation
│   ├── GlitchText.tsx      # Text glitch effect
│   ├── HorrorBlock.tsx     # Block screen with horror
│   └── Penance.tsx         # 1-hour penance screen
├── services/
│   └── storageService.ts   # Chrome storage management
├── App.tsx                 # Main React app
├── background.js           # Chrome extension background worker
├── manifest.json           # Extension configuration
├── types.ts                # TypeScript interfaces
├── vite.config.ts          # Build configuration
└── dist/                   # Built extension (ready to load)
```

## How It Works

### 1. Burying a Website
```
User enters domain → Burial ritual animation → Site saved to storage
→ Background worker starts monitoring
```

### 2. Blocking Access
```
User navigates to buried site → Background worker detects URL
→ Checks if still locked → Checks temp unlock status
→ Redirects to horror page if blocked
```

### 3. Penance System
```
User clicks "Challenge the Void" → 1-hour timer starts
→ Horror animations play → User must not close window
→ After 1 hour → Temp unlock granted for 10 minutes
→ After 10 minutes → Blocked again
```

## Technical Details

### Storage Structure
```javascript
{
  skinnerbox_graves: [
    {
      id: "uuid",
      name: "Instagram",
      url: "instagram.com",
      buriedAt: timestamp,
      unlockAt: timestamp,
      attempts: 0
    }
  ],
  skinnerbox_temp_unlocks: {
    "site-id": {
      expiresAt: timestamp
    }
  }
}
```

### URL Matching Logic
- Extracts domain from URL
- Compares with buried site domains
- Matches if either contains the other
- Also checks site name for flexibility

### Horror Media Sources
- All from Giphy (external CDN)
- No local storage required
- Rotates through 10 different horror GIFs
- Fallback to solid colors if network fails

## Build Process

1. **Development**: `npm run dev` - Vite dev server
2. **Production**: `npm run build` - Creates `dist/` folder
3. **Extension Files**: Vite plugin copies manifest, background.js, icon
4. **Output**: Ready-to-load Chrome extension in `dist/`

## Installation

1. Build: `npm install && npm run build`
2. Chrome: `chrome://extensions/` → Developer mode → Load unpacked → Select `dist/`
3. Done: Extension icon appears in toolbar

## Usage

1. Click extension icon
2. Enter domain (e.g., `youtube.com`)
3. Choose days (1-365)
4. Click "Bury Website"
5. Try to visit → Blocked with horror

## Customization Options

### Change Penance Duration
Edit `components/Penance.tsx`:
```typescript
const DURATION = 3600; // Change to desired seconds
```

### Add More Horror Media
Edit `components/Penance.tsx` or `HorrorBlock.tsx`:
```typescript
const HORROR_MEDIA = [
  'url1',
  'url2',
  // Add more URLs
];
```

### Modify Block Messages
Edit `components/HorrorBlock.tsx`:
```typescript
// Change the "NOT. YET." text or other messages
```

### Adjust Temporary Unlock Time
Edit `services/storageService.ts`:
```typescript
const expiresAt = Date.now() + (10 * 60 * 1000); // Change 10 to desired minutes
```

## Known Limitations

1. **Incognito Mode**: Must be manually enabled in extension settings
2. **Other Browsers**: Only works in Chrome (can be ported to Firefox)
3. **VPN/Proxy**: Can't block if user changes network settings
4. **Determined Users**: Can disable extension or edit code
5. **Horror Media**: Requires internet connection to load GIFs

## Future Enhancements

- [ ] Sound effects for horror scenes
- [ ] More horror animation sources
- [ ] Statistics dashboard (time saved, attempts, etc.)
- [ ] Export/import burial lists
- [ ] Scheduled burials (auto-bury during work hours)
- [ ] Whitelist mode (block everything except allowed sites)
- [ ] Mobile app version
- [ ] Sync across devices
- [ ] Custom horror media upload
- [ ] Difficulty levels (easy/medium/hard penance)

## Philosophy

This extension uses **negative reinforcement** psychology:
- Makes bad habits unpleasant
- Creates friction before access
- Forces conscious decision-making
- Uses time as currency (most valuable resource)
- Builds awareness through attempt tracking

The goal isn't perfect blocking - it's making you **think** before you act.

## License

MIT - Do whatever you want with it

## Credits

- Horror GIFs: Giphy
- Icons: Lucide React
- Animations: Framer Motion
- Framework: React + Vite
- Concept: Inspired by commitment devices and behavioral psychology
