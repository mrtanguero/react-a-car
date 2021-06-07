import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import App from './App';
import AllProviders from './context/AllProviders';

ReactDOM.render(
  <AllProviders>
    <App />
  </AllProviders>,
  document.getElementById('root')
);
