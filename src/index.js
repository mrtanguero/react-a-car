import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './App';
import AllProviders from './context/AllProviders';
import InitialSpinner from './components/InitialSpinner/InitialSpinner';

ReactDOM.render(
  <AllProviders>
    <Suspense fallback={<InitialSpinner />}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </Suspense>
  </AllProviders>,
  document.getElementById('root')
);
