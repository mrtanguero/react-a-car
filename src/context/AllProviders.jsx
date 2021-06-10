import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './authContext';
import { ModalPropsProvider } from './modalContext';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function AllProviders({ children }) {
  const queryClient = new QueryClient();

  return (
    <ModalPropsProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ModalPropsProvider>
  );
}
