import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// HTML'deki "root" id'li kutuyu buluyoruz
const rootElement = document.getElementById('root');

// Eğer kutu varsa React'i başlatıyoruz
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
