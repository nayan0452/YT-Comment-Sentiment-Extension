// Options page script

document.addEventListener('DOMContentLoaded', function () {
  loadSettings();

  document.getElementById('saveBtn').addEventListener('click', saveSettings);
});

function loadSettings() {
  chrome.storage.sync.get([
    'enableAnalysis',
    'analysisDelay',
    'showIcons',
    'showLabels',
    'modelType',
    'confidenceThreshold',
    'indicatorPosition',
    'colorScheme'
  ], function (result) {
    document.getElementById('enableAnalysis').checked = result.enableAnalysis !== false;
    document.getElementById('analysisDelay').value = result.analysisDelay || 500;
    document.getElementById('showIcons').checked = result.showIcons !== false;
    document.getElementById('showLabels').checked = result.showLabels !== false;
    document.getElementById('modelType').value = result.modelType || 'simple';
    document.getElementById('confidenceThreshold').value = result.confidenceThreshold || 0.6;
    document.getElementById('indicatorPosition').value = result.indicatorPosition || 'header';
    document.getElementById('colorScheme').value = result.colorScheme || 'default';
  });
}

function saveSettings() {
  const settings = {
    enableAnalysis: document.getElementById('enableAnalysis').checked,
    analysisDelay: parseInt(document.getElementById('analysisDelay').value),
    showIcons: document.getElementById('showIcons').checked,
    showLabels: document.getElementById('showLabels').checked,
    modelType: document.getElementById('modelType').value,
    confidenceThreshold: parseFloat(document.getElementById('confidenceThreshold').value),
    indicatorPosition: document.getElementById('indicatorPosition').value,
    colorScheme: document.getElementById('colorScheme').value
  };

  chrome.storage.sync.set(settings, function () {
    showStatus('Settings saved successfully!', 'success');

    // Notify content scripts of settings change
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(tab => {
        if (tab.url && tab.url.includes('youtube.com')) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'settingsUpdated',
            settings: settings
          });
        }
      });
    });
  });
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = 'block';

  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}