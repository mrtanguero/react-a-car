import React from 'react';
import { Redirect, Route } from 'react-router';

export default function ProtectedRoute({ jwt, path, exact, children }) {
  return (
    <>
      {jwt ? (
        <Route path={path} exact={exact}>
          {children}
        </Route>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
}
