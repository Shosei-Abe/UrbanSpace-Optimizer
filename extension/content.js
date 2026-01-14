// Friction Chrome Extension - Content Script
// Detects credit card inputs and also analyzes product pages

(function () {
    'use strict';

    // Configuration
    const API_URL = 'http://localhost:3000/api/extension/event';
    const ANALYSIS_API_URL = 'http://localhost:3000/api/analysis/price';
    // const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes default

    // State
    let modalShown = false;
    let lastNudgeTime = 0;
    let userId = null;
    let analysisResult = null;
    let settings = {
        warnThreshold: 50,
        cooldownMinutes: 15
    };

    const CC_PATTERNS = {
        number: [/card.*number/i, /cc.*num/i, /credit.*card/i, /card.*no/i, /pan/i, /ccnumber/i, /cardnumber/i],
        cvv: [/cvv/i, /cvc/i, /csc/i, /security.*code/i, /card.*code/i],
        expiry: [/expir/i, /exp.*date/i, /mm.*yy/i, /valid.*thru/i]
    };
    const AUTOCOMPLETE_CC = ['cc-number', 'cc-exp', 'cc-exp-month', 'cc-exp-year', 'cc-csc', 'cc-name', 'cc-type'];

    const SITE_SELECTORS = {
        'amazon': { title: '#productTitle', price: '.a-price .a-offscreen' },
        'temu': { title: '.goods-title-text', price: '.g-price-sale' },
        'shein': { title: '.product-intro__head-name', price: '.product-intro__head-price .original' },
        'aliexpress': { title: '.pdp-info-right .title--wrap--single', price: '.pdp-info-right .price--current--Text' }
    };

    function loadSettings() {
        chrome.storage.local.get(['userId', 'settings'], function (result) {
            if (result.userId) userId = result.userId;
            if (result.settings) settings = { ...settings, ...result.settings };
        });
    }

    function isCreditCardField(input) {
        const autocomplete = input.getAttribute('autocomplete') || '';
        if (AUTOCOMPLETE_CC.some(ac => autocomplete.includes(ac))) return true;

        const check = `${input.getAttribute('name') || ''} ${input.getAttribute('id') || ''} ${input.getAttribute('placeholder') || ''} ${input.getAttribute('aria-label') || ''}`.toLowerCase();
        for (const patterns of Object.values(CC_PATTERNS)) {
            if (patterns.some(p => p.test(check))) return true;
        }
        if (input.getAttribute('maxlength') === '16' || input.getAttribute('maxlength') === '19') {
            const type = input.getAttribute('type') || 'text';
            if (['text', 'tel', 'number'].includes(type)) return true;
        }
        return false;
    }

    function getProductInfo() {
        // Try Meta Tags first (Standard Open Graph) - Works on many sites including Amazon/Temu often
        const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
        const ogPrice = document.querySelector('meta[property="product:price:amount"]')?.content ||
            document.querySelector('meta[property="og:price:amount"]')?.content;

        if (ogTitle && ogPrice) {
            const priceVal = parseFloat(ogPrice);
            if (!isNaN(priceVal)) {
                return { title: ogTitle, price: priceVal };
            }
        }

        // Fallback to specific selectors
        const host = window.location.hostname;
        let site = null;
        if (host.includes('amazon')) site = 'amazon';
        else if (host.includes('temu')) site = 'temu';
        else if (host.includes('shein')) site = 'shein';
        else if (host.includes('aliexpress')) site = 'aliexpress';

        if (!site) return null;
        const selectors = SITE_SELECTORS[site];
        const titleEl = document.querySelector(selectors.title);
        const priceEl = document.querySelector(selectors.price);

        if (titleEl && priceEl) {
            const priceVal = parseFloat((priceEl.innerText || priceEl.textContent).replace(/[^0-9.]/g, ''));
            return { title: (titleEl.innerText || '').trim(), price: priceVal };
        }
        return null;
    }

    async function analyzeProduct() {
        const product = getProductInfo();
        if (!product || isNaN(product.price)) return;

        try {
            const res = await fetch(ANALYSIS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: product.title, price: product.price })
            });
            const data = await res.json();
            analysisResult = data;
        } catch (e) { console.error('Friction Analysis Error:', e); }
    }

    function createNudgeModal() {
        const modal = document.createElement('div');
        modal.id = 'friction-nudge-modal';

        let analysisHtml = '';
        if (analysisResult) {
            const color = analysisResult.recommendation === 'BUY' ? '#4ade80' :
                analysisResult.recommendation === 'WAIT' ? '#facc15' : '#f87171';
            analysisHtml = `
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid ${color}">
                    <h3 style="margin:0 0 5px 0; font-size: 16px;">AI Recommendation: ${analysisResult.recommendation}</h3>
                    <p style="margin:0; font-size: 14px; opacity: 0.9">${analysisResult.reasoning.substring(0, 100)}...</p>
                    ${analysisResult.fairPrice ? `<p style="margin:5px 0 0; font-size: 12px;">Est. Fair Price: $${analysisResult.fairPrice}</p>` : ''}
                </div>
            `;
        }

        modal.innerHTML = `
      <div class="friction-modal-backdrop"></div>
      <div class="friction-modal-content">
        <div class="friction-modal-header">
          <div class="friction-modal-icon">🛡️</div>
          <h2>Wait — Is this purchase intentional?</h2>
        </div>
        <div class="friction-modal-body">
            ${analysisHtml}
            <div class="friction-questions">
                <div class="friction-question"><span class="friction-question-icon">💭</span><span>How will you feel about this in 7 days?</span></div>
                <div class="friction-question"><span class="friction-question-icon">🎯</span><span>Does this fit your spending goals?</span></div>
            </div>
        </div>
        <div class="friction-modal-actions">
          <button class="friction-btn friction-btn-primary" id="friction-cancel">🛡️ Cancel Purchase</button>
          <button class="friction-btn friction-btn-secondary" id="friction-continue">Continue Anyway</button>
        </div>
        <label class="friction-checkbox-label">
          <input type="checkbox" id="friction-dont-show"><span>Don't show for this site</span>
        </label>
      </div>`;

        document.body.appendChild(modal);

        document.getElementById('friction-cancel').addEventListener('click', () => handleDecision('cancelled'));
        document.getElementById('friction-cancel').addEventListener('click', () => handleDecision('cancelled'));
        document.getElementById('friction-continue').addEventListener('click', () => {
            handleDecision('continued');
            // Redirect to dashboard to trigger agent
            window.location.href = 'http://localhost:3000/dashboard?triggerAgent=true';
        });
        modal.querySelector('.friction-modal-backdrop').addEventListener('click', hideModal);

        return modal;
    }

    function showModal() {
        if (modalShown) return;
        const now = Date.now();
        if (now - lastNudgeTime < (settings.cooldownMinutes * 60 * 1000)) return;

        chrome.storage.local.get(['ignoredSites'], function (result) {
            if ((result.ignoredSites || []).includes(window.location.hostname)) return;

            // Re-create modal to ensure updated analysis
            const existing = document.getElementById('friction-nudge-modal');
            if (existing) existing.remove();

            const modal = createNudgeModal();
            requestAnimationFrame(() => modal.classList.add('friction-modal-visible'));
            modalShown = true;
            lastNudgeTime = now;
        });
    }

    function hideModal() {
        const modal = document.getElementById('friction-nudge-modal');
        if (modal) {
            modal.classList.remove('friction-modal-visible');
            modalShown = false;
        }
    }

    function handleDecision(outcome) {
        hideModal();
        if (document.getElementById('friction-dont-show')?.checked) {
            chrome.storage.local.get(['ignoredSites'], (res) => {
                const ignored = res.ignoredSites || [];
                ignored.push(window.location.hostname);
                chrome.storage.local.set({ ignoredSites: ignored });
            });
        }
        if (userId) {
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, domain: window.location.hostname, outcome, timestamp: new Date().toISOString() })
            }).catch(e => console.log('Log Error', e));
        }
        if (outcome === 'cancelled') {
            document.querySelectorAll('input').forEach(i => {
                if (isCreditCardField(i)) { i.value = ''; i.blur(); }
            });
        }
    }

    function setupFieldMonitoring() {
        document.addEventListener('focusin', e => {
            if (e.target.tagName === 'INPUT' && isCreditCardField(e.target)) showModal();
        });
        // (Mutation observer logic can be added here if needed, omitted for brevity but recommended for SPA)
    }

    function checkAuthSync() {
        const syncEl = document.getElementById('friction-auth-sync');
        if (syncEl) {
            const userIdFromPage = syncEl.getAttribute('data-user-id');
            if (userIdFromPage && userIdFromPage !== userId) {
                console.log('Friction: Synced User ID', userIdFromPage);
                userId = userIdFromPage;
                chrome.storage.local.set({ userId: userIdFromPage });
            }
        }
    }

    // Monitor DOM for auth sync element (SPA navigation)
    function setupAuthObserver() {
        const observer = new MutationObserver((mutations) => {
            checkAuthSync();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        loadSettings();
        setupFieldMonitoring();
        checkAuthSync(); // Check immediately
        setupAuthObserver(); // And watch for changes
        analyzeProduct(); // Trigger analysis on load
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
