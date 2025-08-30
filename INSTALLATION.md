# Installation Guide

## Quick Start

1. **Download the Extension**
   - Clone this repository or download as ZIP
   - Extract to a folder on your computer

2. **Generate Icons** (Optional)
   - Open `create-icons.html` in your browser
   - Right-click each canvas and save as PNG
   - Save as `icon16.png`, `icon48.png`, `icon128.png` in the `icons/` folder

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder
   - The extension should now appear in your extensions list

4. **Test the Extension**
   - Go to any YouTube video (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
   - Scroll down to the comments section
   - You should see sentiment indicators appear next to comments
   - Click the extension icon in the toolbar to see statistics

## Troubleshooting

### Extension Not Loading
- Make sure all files are in the same folder
- Check that `manifest.json` is in the root folder
- Look for errors in Chrome's extension management page

### No Sentiment Indicators Appearing
- Make sure you're on a YouTube video page (`/watch?v=...`)
- Check the browser console (F12) for JavaScript errors
- Try refreshing the page
- Click the extension popup and ensure analysis is enabled

### Icons Not Showing
- The extension will work without custom icons
- Chrome will use default icons if the icon files are missing
- You can create simple PNG files or use the provided HTML generator

## Development Setup

### For AI Model Integration

1. **Local Models (TensorFlow.js)**
   ```bash
   # Add to your HTML or load via CDN
   <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
   ```

2. **ONNX Models**
   ```bash
   # Add ONNX.js
   <script src="https://cdn.jsdelivr.net/npm/onnxjs/dist/onnx.min.js"></script>
   ```

3. **External API**
   - Update the API endpoint in `ai-model-integration.js`
   - Add your API key to the headers
   - Ensure CORS is properly configured

### Testing Different Models

1. Open `options.html` by right-clicking the extension and selecting "Options"
2. Change the model type in settings
3. Refresh YouTube pages to see the new model in action

## File Structure

```
youtube-sentiment-extension/
├── manifest.json              # Extension configuration
├── content.js                 # Main functionality
├── ai-model-integration.js    # AI model management
├── background.js              # Background service worker
├── popup.html                 # Extension popup UI
├── popup.js                   # Popup functionality
├── options.html               # Settings page
├── options.js                 # Settings functionality
├── styles.css                 # Comment indicator styles
├── icons/                     # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md                  # Documentation
├── INSTALLATION.md            # This file
└── create-icons.html          # Icon generator utility
```

## Next Steps

1. **Customize the Analysis**: Modify the sentiment analysis logic in `ai-model-integration.js`
2. **Add Your AI Model**: Replace the simple keyword analysis with your preferred model
3. **Styling**: Customize the appearance by editing `styles.css`
4. **Settings**: Add more configuration options in `options.html`

## Publishing to Chrome Web Store

1. Test thoroughly across different YouTube pages
2. Create proper icon files (16x16, 48x48, 128x128 PNG)
3. Update version number in `manifest.json`
4. Zip the entire extension folder
5. Upload to Chrome Web Store Developer Dashboard
6. Fill out store listing details
7. Submit for review

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files are present and correctly named
3. Test on different YouTube videos
4. Try disabling other extensions that might conflict