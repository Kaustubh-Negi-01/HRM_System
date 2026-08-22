import React from 'react';
import ReactDOM from 'react-dom/client';

// Typography & Base Styles
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/theme.css';
import './styles/index.css';

// BrowserRouter lives inside App.jsx (auth-aware routing)
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
