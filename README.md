# 🪦 SkinnerBox - Horror Website Blocker

A Chrome extension that helps you break digital addictions through horror-themed website blocking. Bury websites for days, and if you try to access them, complete an educational quest powered by AI to earn temporary access.

## Features

- **Bury Websites**: Block any website for a custom number of days (1-365)
- **Educational Quest System**: Learn something new to unlock sites temporarily
- **AI-Powered Content**: Uses Google Gemini to generate custom educational content
- **Quiz Combat**: Answer questions correctly to defeat ghosts and progress
- **Horror Theme**: Full horror aesthetic with animations and effects
- **Temporary Unlock**: Complete the quest to get 10 minutes of access
- **Attempt Tracking**: See how many times you've tried to break your commitment
- **Persistent Blocking**: Sites stay blocked even after the burial period ends (manual deletion required)

## Installation

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build the extension
npm run build

# 3. Load in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode" (top right)
# - Click "Load unpacked"
# - Select the "dist" folder
```

That's it! The extension should load without any errors.

### If You See Errors

**"MIME type error" or "CSP violation":**
- Make sure you ran `npm run build` (not `npm run dev`)
- Select the `dist` folder (not the root folder)
- Reload the extension after building

**Extension not working:**
- Check Chrome version (need 120+)
- See `TROUBLESHOOTING.md` for detailed help
- See `FINAL_FIX.md` for technical details

## How It Works

1. **Bury a Website**: Enter a domain (e.g., `instagram.com`) and choose how many days to block it
2. **Automatic Blocking**: The extension monitors all tabs and redirects to a horror page if you try to visit a buried site
3. **Learning Quest**: Choose a topic you want to learn about (e.g., "JavaScript", "History", "Science")
4. **AI Content Generation**: Gemini AI generates 3 educational sections with quizzes
5. **Quiz Combat**: 
   - Read each section
   - Answer the quiz question
   - **Correct answer** = Your character kills the ghost, move to next section
   - **Wrong answer** = Ghost attacks you (lose 1 heart), try again
   - **Lose all hearts** = Quest restarts from beginning
6. **Victory**: Complete all 3 sections to unlock the site for 10 minutes
7. **Re-blocking**: Sites remain in your graveyard even after the burial period ends - you must manually delete them to permanently unblock

## Setup

### 1. Install the Extension

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Load in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode" (top right)
# - Click "Load unpacked"
# - Select the "dist" folder
```

### 2. Get a Gemini API Key

The Learning Quest feature requires a free Gemini API key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 3. Add Your API Key

Open the extension popup, press F12 for Developer Tools, and run:

```javascript
localStorage.setItem('gemini_api_key', 'YOUR_API_KEY_HERE');
```

See `GEMINI_SETUP.md` for detailed instructions.

## Usage Tips

- Enter just the domain name (e.g., `youtube.com`, `twitter.com`, `reddit.com`)
- The extension will block all URLs containing that domain
- You can bury multiple sites at once
- The timer continues even if you close Chrome
- Closing the penance window resets the timer

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Chrome Extension Manifest V3

## Development

Run in development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## License

MIT
