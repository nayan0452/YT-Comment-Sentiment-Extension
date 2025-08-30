// Simple test version without AI model dependency
// Replace ai-model-integration.js with this for testing

console.log('Simple test mode - no AI model required');

// Mock AIModelManager for testing
window.AIModelManager = class {
  constructor() {
    console.log('Mock AI Model Manager initialized');
  }
  
  async predict(text) {
    // Simple keyword-based analysis for testing
    const positiveWords = ['good', 'great', 'awesome', 'amazing', 'love', 'excellent'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible'];
    
    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore++;
    });

    if (positiveScore > negativeScore) return 'good';
    if (negativeScore > positiveScore) return 'bad';
    return 'neutral';
  }
};