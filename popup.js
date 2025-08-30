// Popup script for YouTube Comment Sentiment Analyzer

document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const refreshBtn = document.getElementById('refreshBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  
  // Load saved settings
  chrome.storage.sync.get(['enabled'], function(result) {
    const enabled = result.enabled !== false; // Default to true
    toggleSwitch.classList.toggle('active', enabled);
  });
  
  // Toggle functionality
  toggleSwitch.addEventListener('click', function() {
    const isActive = toggleSwitch.classList.contains('active');
    const newState = !isActive;
    
    toggleSwitch.classList.toggle('active', newState);
    
    // Save setting
    chrome.storage.sync.set({ enabled: newState });
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com/watch')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleAnalysis',
          enabled: newState
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.log('Could not toggle:', chrome.runtime.lastError.message);
          }
        });
      }
    });
  });
  
  // Refresh button
  refreshBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com/watch')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'refreshAnalysis'
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.log('Could not refresh:', chrome.runtime.lastError.message);
          }
        });
      }
    });
    
    // Update stats after a delay
    setTimeout(updateStats, 500);
  });
  
  // Settings button (placeholder)
  settingsBtn.addEventListener('click', function() {
    // Open options page or show settings modal
    chrome.runtime.openOptionsPage();
  });
  
  // Update stats on popup open
  updateStats();
  
  function updateStats() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com/watch')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'getStats'
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.log('Content script not ready:', chrome.runtime.lastError.message);
            // Set default values
            document.getElementById('goodCount').textContent = '0';
            document.getElementById('neutralCount').textContent = '0';
            document.getElementById('badCount').textContent = '0';
            return;
          }
          
          if (response && response.stats) {
            document.getElementById('goodCount').textContent = response.stats.good || 0;
            document.getElementById('neutralCount').textContent = response.stats.neutral || 0;
            document.getElementById('badCount').textContent = response.stats.bad || 0;
          }
        });
      } else {
        // Not on a YouTube watch page
        document.getElementById('goodCount').textContent = '-';
        document.getElementById('neutralCount').textContent = '-';
        document.getElementById('badCount').textContent = '-';
      }
    });
  }
});