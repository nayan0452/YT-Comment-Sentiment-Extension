# YouTube Comment Sentiment Analyzer

A Chrome extension that analyzes YouTube comments and displays sentiment indicators (Good/Bad/Neutral) directly in the comment section.

## Features

- **Real-time Analysis**: Automatically analyzes comments as they load
- **Visual Indicators**: Shows sentiment with icons and labels
- **Customizable**: Adjustable settings for display and analysis
- **Lightweight**: Runs entirely in the browser
- **Privacy-focused**: No data sent to external servers (when using local analysis)

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. Navigate to any YouTube video to see the extension in action

## How It Works

The extension uses a content script that:
1. Monitors the YouTube page for new comments
2. Extracts comment text
3. Analyzes sentiment using configurable methods
4. Displays visual indicators next to comments

## Current Implementation

The extension currently uses a simple keyword-based sentiment analysis for demonstration purposes. This can be easily replaced with:

- Local AI models (TensorFlow.js, ONNX.js)
- External API calls
- More sophisticated NLP libraries

## AI Model Integration

To integrate your own AI model:

1. **Local Model**: Replace the `analyzeSentiment` method in `content.js`
2. **External API**: Modify the background script to handle API calls
3. **WebAssembly**: Add WASM modules for high-performance local inference

### Example AI Model Integration

```javascript
async analyzeSentiment(text) {
  // Option 1: Local TensorFlow.js model
  const prediction = await this.model.predict(text);
  return this.convertPredictionToSentiment(prediction);
  
  // Option 2: External API
  const response = await fetch('your-api-endpoint', {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' }
  });
  const result = await response.json();
  return result.sentiment;
}
```

## File Structure

```
├── manifest.json          # Extension configuration
├── content.js             # Main content script
├── background.js          # Background service worker
├── popup.html/js          # Extension popup interface
├── options.html/js        # Settings page
├── styles.css             # Comment indicator styles
└── icons/                 # Extension icons
```

## Customization

### Adding New Sentiment Categories

1. Update the sentiment analysis logic in `content.js`
2. Add corresponding CSS classes in `styles.css`
3. Update the popup statistics display

### Changing Visual Appearance

Modify `styles.css` to customize:
- Indicator colors and shapes
- Animation effects
- Positioning and sizing

## Privacy & Security

- All analysis happens locally in the browser
- No comment data is transmitted externally
- Minimal permissions required
- Open source and auditable

## Development

### Testing
1. Load the extension in developer mode
2. Open YouTube and navigate to any video
3. Check the browser console for any errors
4. Use the popup to view statistics and toggle features

### Building for Production
1. Update version in `manifest.json`
2. Test thoroughly across different YouTube pages
3. Package as .zip for Chrome Web Store submission

## Future Enhancements

- [ ] Batch processing for better performance
- [ ] Comment thread sentiment aggregation
- [ ] Export sentiment data
- [ ] Multi-language support
- [ ] Advanced filtering options

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.
