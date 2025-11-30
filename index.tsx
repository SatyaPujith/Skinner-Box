import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Wait for DOM to be ready before mounting
function initApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  // Detect if we're in popup mode or full-screen mode
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  const isPopup = window.innerWidth < 500 && !view;
  
  // Apply appropriate body class
  if (isPopup) {
    document.body.classList.add('popup-mode');
  } else {
    document.body.classList.add('fullscreen-mode');
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already ready
  initApp();
}