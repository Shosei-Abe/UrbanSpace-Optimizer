// Friction Chrome Extension - Popup Script

document.addEventListener('DOMContentLoaded', function () {
    const userIdInput = document.getElementById('userId');
    const saveBtn = document.getElementById('save');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const message = document.getElementById('message');

    // Load existing user ID
    chrome.storage.local.get(['userId', 'settings'], function (result) {
        if (result.userId) {
            userIdInput.value = result.userId;
            updateStatus(true);
        }
    });

    // Save user ID and fetch settings
    saveBtn.addEventListener('click', async function () {
        const userId = userIdInput.value.trim();

        if (!userId) {
            showMessage('Please enter a user ID', true);
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Connecting...';

        try {
            // Fetch user settings from the server
            const response = await fetch(`http://localhost:3000/api/extension/settings?userId=${encodeURIComponent(userId)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }

            const settings = await response.json();

            // Save userId and settings to local storage
            chrome.storage.local.set({
                userId: userId,
                settings: settings
            }, function () {
                updateStatus(true);
                showMessage('Connected successfully! Settings synced.', false);
            });
        } catch (error) {
            console.error('Failed to connect:', error);
            // Still save the userId even if settings fetch fails
            chrome.storage.local.set({ userId: userId }, function () {
                updateStatus(true);
                showMessage('Connected! (Using default settings)', false);
            });
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
        }
    });

    function updateStatus(connected) {
        if (connected) {
            statusDot.classList.remove('inactive');
            statusText.innerHTML = '<strong>Connected</strong> — Nudges active';
        } else {
            statusDot.classList.add('inactive');
            statusText.innerHTML = '<strong>Not connected</strong>';
        }
    }

    function showMessage(text, isError) {
        message.textContent = text;
        message.className = 'message show' + (isError ? ' error' : '');
        setTimeout(function () {
            message.classList.remove('show');
        }, 3000);
    }
});
