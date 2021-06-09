import React from 'react';
import { Redirect, Route } from 'react-router';

export default function PrivateRoute({ jwt, path, children, ...otherProps }) {
  return (
    <>
      {jwt ? (
        <Route path={path} {...otherProps}>
          {children}
        </Route>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
}
