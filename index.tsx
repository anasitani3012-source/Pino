
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.debug("[Pino] Initializing application...");
console.debug("[Pino] Environment check:", {
  hasApiKey: !!process.env.API_KEY,
  userAgent: navigator.userAgent,
  timestamp: new Date().toISOString()
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.debug("[Pino] ServiceWorker registration successful with scope: ", registration.scope);
      })
      .catch(err => {
        console.warn("[Pino] ServiceWorker registration failed: ", err);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("[Pino] Critical Error: Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.debug("[Pino] React mount successful");
} catch (error) {
  console.error("[Pino] Failed to render React tree:", error);
}
