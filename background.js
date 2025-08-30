// Background script for YouTube Comment Sentiment Analyzer

chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Comment Sentiment Analyzer installed');
});

// Handle messages from content script if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeSentiment') {
    // This is where you would integrate with your AI model
    // For now, just echo back a placeholder response
    sendResponse({ sentiment: 'neutral' });
  }
});

// Optional: Add context menu item (only if contextMenus permission is available)
try {
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'analyzeSentiment',
      title: 'Analyze Comment Sentiment',
      contexts: ['selection']
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === 'analyzeSentiment') {
        chrome.tabs.sendMessage(tab.id, {
          action: 'analyzeSelection',
          text: info.selectionText
        });
      }
    });
  }
} catch (error) {
  console.log('Context menus not available:', error);
}