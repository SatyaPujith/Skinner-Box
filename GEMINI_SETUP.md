# Gemini API Setup Guide

The Learning Quest feature requires a Gemini API key to generate educational content.

## Getting Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Adding the API Key to the Extension

### Method 1: Browser Console (Recommended)
1. Open the extension popup
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Run this command (replace with your actual key):
```javascript
localStorage.setItem('gemini_api_key', 'YOUR_API_KEY_HERE');
```

### Method 2: Add Settings UI (Future Enhancement)
We can add a settings page to the extension where users can input their API key through a proper UI.

## Testing the Feature

1. Try to visit a blocked website
2. Click "LEARN TO ESCAPE"
3. Enter a topic (e.g., "JavaScript", "World War 2", "Quantum Physics")
4. The system will generate 3 educational sections with quizzes
5. Read each section and answer the quiz correctly to progress
6. Complete all 3 sections to unlock the site

## How It Works

- **Correct Answer**: Your character kills the ghost, you move to the next section
- **Wrong Answer**: The ghost attacks you (lose 1 heart), try the same quiz again
- **Lose All Hearts**: Quest restarts from the beginning
- **Complete All Sections**: Door opens, site is unlocked for 10 minutes

## API Usage Notes

- The Gemini API has a free tier with generous limits
- Each quest uses 1 API call to generate all 3 sections
- Content is generated fresh each time (no caching)
- The API key is stored locally in your browser

## Privacy

- Your API key is stored only in your browser's localStorage
- No data is sent to any server except Google's Gemini API
- The extension does not collect or transmit your API key anywhere else
