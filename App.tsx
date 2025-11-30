import React, { useState, useEffect } from 'react';
import { Skull, Lock, EyeOff, ExternalLink, Ghost, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BuriedSite, ViewState } from './types';
import { getBuriedSites, burySite, updateAttempts, excavateSite, syncStorage, grantTempAccess } from './services/storageService';
import { Coffin } from './components/Coffin';
import { HorrorBlock } from './components/HorrorBlock';

// Helper to format remaining time
const getTimeRemaining = (endTime: number) => {
  const total = endTime - Date.now();
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days };
};

export default function App() {
  const [sites, setSites] = useState<BuriedSite[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [ritualTarget, setRitualTarget] = useState<{name: string, url: string, days: number} | null>(null);
  const [activeBlock, setActiveBlock] = useState<BuriedSite | null>(null);

  // Load sites on mount
  useEffect(() => {
    syncStorage();
    setSites(getBuriedSites());

    // Check for URL params
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    
    // Handle horror block redirect
    const idParam = params.get('id');
    if (viewParam === 'horror' && idParam) {
      const allSites = getBuriedSites();
      const blockedSite = allSites.find(s => s.id === idParam);
      
      if (blockedSite) {
        setActiveBlock(blockedSite);
        setView('horror');
        updateAttempts(blockedSite.id);
      }
    }
    
    // Handle ritual view from popup
    const nameParam = params.get('name');
    const urlParam = params.get('url');
    const daysParam = params.get('days');
    
    if (viewParam === 'ritual' && nameParam && urlParam && daysParam) {
      setRitualTarget({
        name: nameParam,
        url: urlParam,
        days: parseInt(daysParam)
      });
      setView('ritual');
    }

    const interval = setInterval(() => {
      // Force re-render for timers
      setSites(getBuriedSites());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRitual = (name: string, url: string, days: number) => {
    // Validate URL format
    let validUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = 'https://' + url;
    }
    
    // Check if we're in a popup (small window) or full page
    const isPopup = window.innerWidth < 500;
    
    if (isPopup && typeof chrome !== 'undefined' && chrome.runtime) {
      // Open ritual in a new tab for better experience
      const ritualUrl = chrome.runtime.getURL(`index.html?view=ritual&name=${encodeURIComponent(name)}&url=${encodeURIComponent(validUrl)}&days=${days}`);
      chrome.tabs.create({ url: ritualUrl });
      window.close(); // Close the popup
    } else {
      // We're already in a full page, show ritual here
      setRitualTarget({ name, url: validUrl, days });
      setView('ritual');
    }
  };

  const handleCompleteRitual = () => {
    if (!ritualTarget) return;
    
    const newSite: BuriedSite = {
      id: crypto.randomUUID(),
      name: ritualTarget.name,
      url: ritualTarget.url,
      buriedAt: Date.now(),
      unlockAt: Date.now() + (ritualTarget.days * 24 * 60 * 60 * 1000),
      attempts: 0
    };
    
    burySite(newSite);
    setSites(getBuriedSites());
    
    // Delay to let the "Slam" effect finish
    setTimeout(() => {
      // Check if we're in a standalone tab (opened from popup)
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'ritual') {
        // Close this tab and let user return to extension popup
        window.close();
      } else {
        // We're in the main extension view, just switch views
        setView('dashboard');
        setRitualTarget(null);
      }
    }, 2000);
  };

  const handleTryVisit = (site: BuriedSite) => {
    // Sites are ALWAYS blocked - must complete quest
    // Open horror block in new tab if in popup, otherwise show in current view
    const isPopup = window.innerWidth < 500;
    
    if (isPopup && typeof chrome !== 'undefined' && chrome.runtime) {
      // Open horror block in new tab
      const horrorUrl = chrome.runtime.getURL(`index.html?view=horror&id=${encodeURIComponent(site.id)}&name=${encodeURIComponent(site.name)}`);
      chrome.tabs.create({ url: horrorUrl });
    } else {
      // Show horror block in current view
      updateAttempts(site.id);
      setActiveBlock(site);
      setView('horror');
    }
  };

  const handleUnblock = () => {
    if (!activeBlock) return;
    
    // Delete the site from graveyard (permanent unblock after completing quest)
    excavateSite(activeBlock.id);
    setSites(getBuriedSites());
    
    // Navigate to the site
    if (activeBlock.url) {
      window.location.href = activeBlock.url;
    } else {
      alert(`QUEST COMPLETE!\n\n${activeBlock.name} is now permanently unblocked!`);
      setView('dashboard');
      setActiveBlock(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 selection:bg-red-900 selection:text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <Dashboard 
            key="dashboard"
            sites={sites} 
            onStartRitual={handleStartRitual}
            onTryVisit={handleTryVisit}
            onDelete={(siteId) => {
              excavateSite(siteId);
              setSites(getBuriedSites());
            }}
          />
        )}
        
        {view === 'ritual' && ritualTarget && (
          <Ritual 
            key="ritual"
            target={ritualTarget}
            onComplete={handleCompleteRitual}
            onCancel={() => setView('dashboard')}
          />
        )}
        
        {view === 'horror' && activeBlock && (
          <HorrorBlock 
            key="horror"
            siteName={activeBlock.name}
            onUnblock={handleUnblock}
            onGiveUp={() => {
              // If we were redirected here, "Give Up" might mean closing the tab
              if (window.location.search.includes('view=horror')) {
                window.close(); // Try to close tab
                setView('dashboard'); // Fallback
              } else {
                setView('dashboard');
              }
              setActiveBlock(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------------
// VIEW: Dashboard
// ------------------------------------------------------------------

interface DashboardProps {
  sites: BuriedSite[];
  onStartRitual: (name: string, url: string, days: number) => void;
  onTryVisit: (site: BuriedSite) => void;
  onDelete: (siteId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  sites, 
  onStartRitual, 
  onTryVisit,
  onDelete
}) => {
  const [formName, setFormName] = useState('');
  const [formDays, setFormDays] = useState(30);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full min-h-screen p-4 relative"
    >
      {/* Blood drip effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-red-900 to-transparent opacity-30" />
      
      {/* Flickering vignette */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)'
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <header style={{ marginBottom: '20px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-horror text-red-700 tracking-wider mb-1 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(220,38,38,0.5)' }}
        >
          SKINNER BOX
        </motion.h1>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <p className="font-analog text-red-900 text-xs tracking-wider uppercase">
            Horror Website Blocker
          </p>
          <motion.div 
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-px bg-red-900"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </motion.div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ADD NEW SECTION */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid #7F1D1D',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 0 30px rgba(220, 38, 38, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Skull size={20} color="#DC2626" />
            <h2 style={{
              fontSize: '18px',
              fontFamily: 'Creepster, cursive',
              color: '#DC2626',
              margin: 0
            }}>
              BURY A NEW SOUL
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#DC2626',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Website URL
              </label>
              <input 
                type="text" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., instagram.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#111827',
                  border: '2px solid #374151',
                  borderRadius: '6px',
                  color: '#e5e5e5',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#DC2626',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Duration: {formDays} {formDays === 1 ? 'Day' : 'Days'}
              </label>
              <input 
                type="range" 
                min="1" 
                max="365" 
                value={formDays}
                onChange={(e) => setFormDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#374151',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#6B7280', marginTop: '4px' }}>
                <span>1 DAY</span>
                <span>1 YEAR</span>
              </div>
            </div>

            <motion.button 
              disabled={!formName}
              onClick={() => {
                const url = formName.includes('.') ? formName : formName + '.com';
                
                // Check if site is already buried
                const alreadyBuried = sites.some(site => 
                  site.url.toLowerCase().includes(formName.toLowerCase()) || 
                  site.name.toLowerCase().includes(formName.toLowerCase())
                );
                
                if (alreadyBuried) {
                  alert(`${formName} is already in the graveyard!`);
                  return;
                }
                
                onStartRitual(formName, url, formDays);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: formName ? '#DC2626' : '#374151',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: formName ? 'pointer' : 'not-allowed',
                opacity: formName ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Skull size={18} />
              <span>BURY FOREVER</span>
            </motion.button>
          </div>
        </motion.div>

        {/* GRAVEYARD SECTION */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid #7F1D1D',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 0 30px rgba(220, 38, 38, 0.2)',
            minHeight: '250px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Skull size={20} color="#DC2626" />
            <h2 style={{
              fontSize: '18px',
              fontFamily: 'Creepster, cursive',
              color: '#DC2626',
              margin: 0
            }}>
              THE GRAVEYARD ({sites.length})
            </h2>
          </div>

          {sites.length === 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              color: '#6B7280',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              No souls buried yet...
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {sites.map((site, index) => {
                const { days } = getTimeRemaining(site.unlockAt);
                const isLocked = days >= 0;

                return (
                  <motion.div 
                    key={site.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative border border-stone-800 bg-black hover:border-red-900/50 transition-all p-3 flex items-center justify-between overflow-hidden"
                  >
                    {/* Hover effect */}
                    <motion.div 
                      className="absolute inset-0 bg-red-950 opacity-0 group-hover:opacity-10 pointer-events-none"
                      whileHover={{ opacity: 0.1 }}
                    />
                    
                    <div className="z-10 flex-1">
                      <h3 className="text-sm font-horror text-stone-300 group-hover:text-red-400 transition-colors">{site.name}</h3>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500 mt-1">
                        <Lock className="w-3 h-3" />
                        <span>{isLocked ? `${days} DAYS LEFT` : 'UNSEALED'}</span>
                      </div>
                      {site.attempts > 0 && (
                        <motion.div 
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-[8px] text-red-900 mt-1 font-bold"
                        >
                          {site.attempts} FAILED ATTEMPTS
                        </motion.div>
                      )}
                    </div>

                    <div className="z-10 flex gap-2">
                      <motion.button 
                        onClick={() => onTryVisit(site)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-stone-900 rounded-full text-stone-500 hover:text-red-500 transition-colors border border-transparent hover:border-stone-800"
                        title="Try to visit"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button 
                        onClick={() => {
                          if (confirm(`Permanently unblock ${site.name}?`)) {
                            onDelete(site.id);
                          }
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-stone-900 rounded-full text-stone-500 hover:text-stone-400 transition-colors border border-transparent hover:border-stone-800"
                        title="Delete from graveyard"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// ------------------------------------------------------------------
// VIEW: Ritual (The Drag and Drop)
// ------------------------------------------------------------------

interface RitualProps {
  target: {name: string, url: string, days: number};
  onComplete: () => void;
  onCancel: () => void;
}

const Ritual: React.FC<RitualProps> = ({ 
  target, 
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<'intro' | 'open' | 'slam'>('intro');

  useEffect(() => {
    // Sequence timer
    if (step === 'intro') {
      setTimeout(() => setStep('open'), 1000);
    }
  }, [step]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      {/* Horror background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <img 
          src="https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif"
          alt="horror"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(100%) contrast(1.5)' }}
        />
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 text-center z-10">
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-horror text-red-700 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]"
        >
          BURIAL RITUAL
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-stone-400 text-sm mt-2 font-analog"
        >
          <span className="text-red-600 font-bold">{target.name.toUpperCase()}</span>
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-stone-600 text-xs mt-1 font-mono"
        >
          SENTENCE: {target.days} DAYS
        </motion.p>
      </div>

      {/* Coffin - centered on screen */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-full max-w-md">
          <Coffin isOpen={step === 'open'} isShaking={step === 'slam'} />
        </div>
      </div>

      {/* Button - absolutely centered on viewport */}
      <AnimatePresence>
        {step === 'open' && (
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, scale: 0, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}
            className="fixed top-1/2 left-1/2 z-50"
            style={{ 
              transform: 'translate(-50%, -120%)',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(220,38,38,0.8)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setStep('slam');
                setTimeout(onComplete, 600);
              }}
              className="bg-gradient-to-b from-stone-100 to-stone-300 text-black font-bold p-8 rounded-lg border-4 border-stone-900 shadow-[0_0_40px_rgba(0,0,0,0.9)] cursor-pointer hover:from-red-100 hover:to-red-200 transition-all"
            >
              <div className="flex flex-col items-center gap-3">
                <Skull className="w-10 h-10 text-red-900" />
                <span className="text-sm font-mono uppercase tracking-wider text-stone-700">Click to Bury</span>
                <span className="text-3xl font-black font-horror text-red-900">{target.name}</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message below */}
      {step === 'open' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-32 left-0 right-0 text-center text-red-900 font-analog text-lg z-10"
        >
          Seal it forever...
        </motion.div>
      )}

      {/* Cancel button */}
      <motion.button 
        onClick={onCancel} 
        whileHover={{ scale: 1.1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-stone-700 hover:text-red-800 text-xs uppercase tracking-widest font-mono border border-stone-800 hover:border-red-900 px-4 py-2 transition-all z-10"
      >
        Abort Ritual
      </motion.button>

      {/* Flickering effect */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none z-20"
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ 
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 3
        }}
      />
    </motion.div>
  );
};