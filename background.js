// Background service worker for blocking buried websites
// Monitors all tab updates and redirects to horror page if site is buried

const TEMP_UNLOCK_KEY = 'skinnerbox_temp_unlocks';

// Listen for tab updates (navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'loading') {
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      checkAndBlockUrl(tabId, tab.url);
    }
  }
});

// Also check when tabs are activated (switched to)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      checkAndBlockUrl(activeInfo.tabId, tab.url);
    }
  });
});

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
}

function checkAndBlockUrl(tabId, url) {
  chrome.storage.local.get(['skinnerbox_graves', TEMP_UNLOCK_KEY], (result) => {
    const sites = result.skinnerbox_graves || [];
    const tempUnlocks = result[TEMP_UNLOCK_KEY] || {};
    const now = Date.now();
    
    const domain = extractDomain(url);
    
    // Find if this URL matches any buried site
    const buriedSite = sites.find(site => {
      const siteDomain = extractDomain(site.url);
      // Match if the domain contains the buried site domain
      return domain.includes(siteDomain) || siteDomain.includes(domain) || 
             url.toLowerCase().includes(site.name.toLowerCase());
    });

    if (buriedSite) {
      // Check if temporarily unlocked (after completing quest)
      const tempUnlock = tempUnlocks[buriedSite.id];
      if (tempUnlock && tempUnlock.expiresAt > now) {
        // Temporarily unlocked, allow access
        console.log(`Site ${buriedSite.name} is temporarily unlocked until ${new Date(tempUnlock.expiresAt)}`);
        return;
      }
      
      // ALWAYS BLOCK - Sites stay blocked even after burial period ends
      // User must manually delete from graveyard to permanently unblock
      const extensionUrl = chrome.runtime.getURL('index.html');
      const redirectUrl = `${extensionUrl}?view=horror&id=${encodeURIComponent(buriedSite.id)}&name=${encodeURIComponent(buriedSite.name)}`;
      
      chrome.tabs.update(tabId, { url: redirectUrl });
    }
  });
}

// Clean up expired temp unlocks periodically
setInterval(() => {
  chrome.storage.local.get([TEMP_UNLOCK_KEY], (result) => {
    const tempUnlocks = result[TEMP_UNLOCK_KEY] || {};
    const now = Date.now();
    let changed = false;
    
    for (const id in tempUnlocks) {
      if (tempUnlocks[id].expiresAt < now) {
        delete tempUnlocks[id];
        changed = true;
      }
    }
    
    if (changed) {
      chrome.storage.local.set({ [TEMP_UNLOCK_KEY]: tempUnlocks });
    }
  });
}, 60000); // Check every minute