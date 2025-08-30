// YouTube Comment Sentiment Analyzer Content Script

class YouTubeSentimentAnalyzer {
  constructor() {
    this.processedComments = new Set();
    this.observer = null;
    this.settings = {
      enabled: true,
      showIcons: true,
      showLabels: true,
      analysisDelay: 500
    };
    this.stats = { good: 0, bad: 0, neutral: 0 };
    
    // Initialize AI model with error handling
    try {
      if (typeof AIModelManager !== 'undefined') {
        this.aiModel = new AIModelManager();
      } else {
        console.warn('AIModelManager not available, using fallback analysis');
        this.aiModel = null;
      }
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      this.aiModel = null;
    }
    
    this.init();
  }

  init() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startAnalysis());
    } else {
      this.startAnalysis();
    }
  }

  startAnalysis() {
    console.log('Starting YouTube sentiment analysis...');
    
    // Start observing for new comments
    this.observeComments();
    
    // Process existing comments with a delay to ensure page is loaded
    setTimeout(() => {
      this.processExistingComments();
    }, 2000);
  }

  observeComments() {
    const commentsContainer = document.querySelector('#comments');
    if (!commentsContainer) {
      // Retry after a delay if comments section not found
      setTimeout(() => this.observeComments(), 2000);
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.processNewComments(node);
          }
        });
      });
    });

    this.observer.observe(commentsContainer, {
      childList: true,
      subtree: true
    });
  }

  processExistingComments() {
    const comments = document.querySelectorAll('ytd-comment-thread-renderer');
    console.log(`Found ${comments.length} comments to process`);
    
    if (comments.length === 0) {
      // Try alternative selectors
      const altComments = document.querySelectorAll('#comment, .comment-renderer, ytd-comment-renderer');
      console.log(`Found ${altComments.length} comments with alternative selector`);
      altComments.forEach(comment => this.processComment(comment));
    } else {
      comments.forEach(comment => this.processComment(comment));
    }
  }

  processNewComments(node) {
    const comments = node.querySelectorAll ? 
      node.querySelectorAll('ytd-comment-thread-renderer') : [];
    
    if (node.matches && node.matches('ytd-comment-thread-renderer')) {
      this.processComment(node);
    }
    
    comments.forEach(comment => this.processComment(comment));
  }

  async processComment(commentElement) {
    const commentId = this.getCommentId(commentElement);
    if (!commentId || this.processedComments.has(commentId)) {
      return;
    }

    const commentText = this.extractCommentText(commentElement);
    if (!commentText) {
      console.log('No comment text found for element:', commentElement);
      return;
    }

    console.log(`Processing comment: "${commentText.substring(0, 50)}..."`);
    this.processedComments.add(commentId);

    try {
      const sentiment = await this.analyzeSentiment(commentText);
      console.log(`Sentiment: ${sentiment} for comment: "${commentText.substring(0, 30)}..."`);
      this.addSentimentIndicator(commentElement, sentiment);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  }

  getCommentId(commentElement) {
    // Try to get a unique identifier for the comment
    const authorElement = commentElement.querySelector('#author-text');
    const timeElement = commentElement.querySelector('.published-time-text');
    
    if (authorElement && timeElement) {
      return `${authorElement.textContent.trim()}-${timeElement.textContent.trim()}`;
    }
    
    return Math.random().toString(36).substring(2, 11);
  }

  extractCommentText(commentElement) {
    // Try multiple selectors for comment text
    const selectors = [
      '#content-text',
      '.comment-text',
      '#comment-content',
      'yt-formatted-string#content-text',
      '[id="content-text"]'
    ];
    
    for (const selector of selectors) {
      const contentElement = commentElement.querySelector(selector);
      if (contentElement && contentElement.textContent.trim()) {
        return contentElement.textContent.trim();
      }
    }
    
    console.log('Could not find comment text in element:', commentElement);
    return null;
  }

  async analyzeSentiment(text) {
    try {
      if (!this.aiModel) {
        // Fallback to simple analysis if AI model failed to initialize
        const sentiment = this.simpleFallbackAnalysis(text);
        this.updateStats(sentiment);
        return sentiment;
      }
      
      const sentiment = await this.aiModel.predict(text);
      this.updateStats(sentiment);
      return sentiment;
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      const sentiment = this.simpleFallbackAnalysis(text);
      this.updateStats(sentiment);
      return sentiment;
    }
  }

  simpleFallbackAnalysis(text) {
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

  updateStats(sentiment) {
    if (this.stats[sentiment] !== undefined) {
      this.stats[sentiment]++;
    }
  }

  addSentimentIndicator(commentElement, sentiment) {
    // Check if indicator already exists
    if (commentElement.querySelector('.sentiment-indicator')) {
      return;
    }

    const indicator = document.createElement('div');
    indicator.className = `sentiment-indicator sentiment-${sentiment}`;
    
    const icon = this.getSentimentIcon(sentiment);
    const label = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
    
    indicator.innerHTML = `
      <span class="sentiment-icon">${icon}</span>
      <span class="sentiment-label">${label}</span>
    `;

    // Try multiple insertion points
    let inserted = false;
    
    // Try #header first (comment header)
    const headerElement = commentElement.querySelector('#header');
    if (headerElement) {
      headerElement.appendChild(indicator);
      inserted = true;
      console.log(`Added ${sentiment} indicator to comment header`);
    }
    
    // If no header, try other locations
    if (!inserted) {
      const authorElement = commentElement.querySelector('#author-text, .author');
      if (authorElement && authorElement.parentNode) {
        authorElement.parentNode.appendChild(indicator);
        inserted = true;
        console.log(`Added ${sentiment} indicator near author`);
      }
    }
    
    // Last resort - add to the comment element itself
    if (!inserted) {
      commentElement.style.position = 'relative';
      indicator.style.position = 'absolute';
      indicator.style.top = '5px';
      indicator.style.right = '5px';
      commentElement.appendChild(indicator);
      console.log(`Added ${sentiment} indicator to comment element`);
    }
  }

  getSentimentIcon(sentiment) {
    switch (sentiment) {
      case 'good': return '👍';
      case 'bad': return '👎';
      case 'neutral': return '😐';
      default: return '❓';
    }
  }

  clearIndicators() {
    const indicators = document.querySelectorAll('.sentiment-indicator');
    indicators.forEach(indicator => indicator.remove());
  }

  applySettings() {
    // Reprocess comments with new settings
    this.clearIndicators();
    this.processedComments.clear();
    if (this.settings.enabled) {
      this.processExistingComments();
    }
  }
}

// Message handling
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  try {
    if (!analyzer) {
      sendResponse({ success: false, error: 'Analyzer not initialized' });
      return true;
    }

    switch (request.action) {
      case 'toggleAnalysis':
        analyzer.settings.enabled = request.enabled;
        if (!request.enabled) {
          analyzer.clearIndicators();
        } else {
          analyzer.processExistingComments();
        }
        sendResponse({ success: true });
        break;
        
      case 'refreshAnalysis':
        analyzer.processedComments.clear();
        analyzer.stats = { good: 0, bad: 0, neutral: 0 };
        analyzer.clearIndicators();
        if (analyzer.settings.enabled) {
          analyzer.processExistingComments();
        }
        sendResponse({ success: true });
        break;
        
      case 'getStats':
        sendResponse({ stats: analyzer.stats });
        break;
        
      case 'settingsUpdated':
        analyzer.settings = { ...analyzer.settings, ...request.settings };
        analyzer.applySettings();
        sendResponse({ success: true });
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Message handler error:', error);
    sendResponse({ success: false, error: error.message });
  }
  return true; // Keep message channel open for async response
});

// Initialize the analyzer when the script loads
let analyzer;
try {
  analyzer = new YouTubeSentimentAnalyzer();
} catch (error) {
  console.error('Failed to initialize YouTube Sentiment Analyzer:', error);
}

// Handle navigation changes (YouTube is a SPA)
let currentUrl = location.href;
new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    if (currentUrl.includes('/watch') && analyzer) {
      // Reset and restart analysis for new video
      setTimeout(() => {
        if (analyzer && analyzer.processedComments) {
          analyzer.processedComments.clear();
          analyzer.startAnalysis();
        }
      }, 1000);
    }
  }
}).observe(document, { subtree: true, childList: true });