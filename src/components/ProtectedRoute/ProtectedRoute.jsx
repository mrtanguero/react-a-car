import React from 'react';
import { Redirect, Route } from 'react-router';
import { useLocation } from 'react-router-dom';

export default function ProtectedRoute({ auth, path, exact, children }) {
  const { pathname } = useLocation();

  if (auth.jwt && auth?.user?.roleId !== 1 && pathname !== '/') {
    return <Redirect to="/unauthorized" />;
  }

  return (
    <>
      {auth?.jwt ? (
        <Route path={path} exact={exact}>
          {children}
        </Route>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
}
