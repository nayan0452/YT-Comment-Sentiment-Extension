// Node.js script to create dummy white icons
// Run with: node create-dummy-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple white PNG data (1x1 pixel, then we'll scale)
function createWhiteIcon(size) {
  // Simple white PNG data - this creates a white square
  const canvas = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="white"/>
    </svg>
  `;
  return canvas;
}

// Create icons directory if it doesn't exist
if (!fs.existsSync('icons')) {
  fs.mkdirSync('icons');
}

// Create SVG icons (Chrome can use SVG for development)
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const svg = createWhiteIcon(size);
  fs.writeFileSync(`icons/icon${size}.svg`, svg);
  console.log(`Created icon${size}.svg`);
});

console.log('Dummy icons created! You can replace them with proper PNG files later.');