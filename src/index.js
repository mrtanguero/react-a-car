import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './App';
import AllProviders from './context/AllProviders';

ReactDOM.render(
  <AllProviders>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </AllProviders>,
  document.getElementById('root')
);
