import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

function renderApp() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 如果在 Cordova 环境中，等待 deviceready
if (window.cordova) {
  document.addEventListener(
    'deviceready',
    () => {
      console.log('Cordova deviceready');
      renderApp();
    },
    false
  );
} else {
  // 浏览器环境，直接渲染
  console.log('Web environment, render directly');
  renderApp();
};