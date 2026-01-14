// Friction Chrome Extension - Background Service Worker

// Listen for installation
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        console.log('Friction extension installed');
        // Open a welcome page or the main app
        // chrome.tabs.create({ url: 'http://localhost:3000/welcome' });
    }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'GET_USER') {
        chrome.storage.local.get(['userId'], function (result) {
            sendResponse({ userId: result.userId });
        });
        return true; // Keep message channel open for async response
    }

    if (request.type === 'SET_USER') {
        chrome.storage.local.set({ userId: request.userId }, function () {
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.type === 'GET_SETTINGS') {
        chrome.storage.local.get(['settings'], function (result) {
            sendResponse({ settings: result.settings || {} });
        });
        return true;
    }

    if (request.type === 'SET_SETTINGS') {
        chrome.storage.local.set({ settings: request.settings }, function () {
            sendResponse({ success: true });
        });
        return true;
    }
});
