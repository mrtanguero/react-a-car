import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './authContext';
import { ModalPropsProvider } from './modalContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import InitialSpinner from '../components/InitialSpinner/InitialSpinner';

export default function AllProviders({ children }) {
  const queryClient = new QueryClient();

  return (
    <ModalPropsProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<InitialSpinner />}>{children}</Suspense>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ModalPropsProvider>
  );
}
