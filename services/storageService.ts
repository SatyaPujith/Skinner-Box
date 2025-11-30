import { BuriedSite } from '../types';

declare const chrome: any;

const STORAGE_KEY = 'skinnerbox_graves';
const TEMP_UNLOCK_KEY = 'skinnerbox_temp_unlocks';

// Helper to check if we are in a Chrome Extension environment
const isExtension = () => {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
};

export const getBuriedSites = (): BuriedSite[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// We save to BOTH localStorage (for React UI instant speed) 
// AND chrome.storage.local (for the background blocker to see)
export const burySite = (site: BuriedSite): void => {
  const current = getBuriedSites();
  const updated = [...current, site];
  
  // 1. Save Local
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // 2. Save to Chrome Storage (if extension)
  if (isExtension()) {
    chrome.storage.local.set({ [STORAGE_KEY]: updated });
  }
};

export const updateAttempts = (id: string): void => {
  const current = getBuriedSites();
  const updated = current.map(site => {
    if (site.id === id) {
      return { ...site, attempts: site.attempts + 1 };
    }
    return site;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  if (isExtension()) {
    chrome.storage.local.set({ [STORAGE_KEY]: updated });
  }
};

export const excavateSite = (id: string): void => {
  const current = getBuriedSites();
  const updated = current.filter(s => s.id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  if (isExtension()) {
    chrome.storage.local.set({ [STORAGE_KEY]: updated });
  }
};

// Grant temporary access after completing penance (10 minutes)
export const grantTempAccess = (siteId: string): void => {
  const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
  
  if (isExtension()) {
    chrome.storage.local.get([TEMP_UNLOCK_KEY], (result: any) => {
      const tempUnlocks = result[TEMP_UNLOCK_KEY] || {};
      tempUnlocks[siteId] = { expiresAt };
      chrome.storage.local.set({ [TEMP_UNLOCK_KEY]: tempUnlocks });
    });
  }
};

// Initial Sync helper (Optional, runs on mount)
export const syncStorage = () => {
  if (isExtension()) {
    // Sync from chrome.storage to localStorage
    chrome.storage.local.get([STORAGE_KEY], (result: any) => {
      if (result[STORAGE_KEY]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result[STORAGE_KEY]));
      }
    });
  }
};