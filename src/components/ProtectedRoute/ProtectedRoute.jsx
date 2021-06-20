import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import { useLocation } from 'react-router-dom';

export default function ProtectedRoute({ auth, path, exact, children }) {
  const { pathname } = useLocation();

  if (auth?.user?.roleId !== 1 && pathname !== '/') {
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

ProtectedRoute.propTypes = {
  auth: PropTypes.object,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  children: PropTypes.node,
};
