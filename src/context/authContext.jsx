import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getAccount } from '../services/account';

const getJWTFromLocalStorage = () => {
  return localStorage.getItem('jwt');
};

const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authContext = React.createContext({
  user: {},
  jwt: '',
  setJwt: () => {},
});

export const AuthProvider = (props) => {
  const [jwt, setJwt] = useState(getJWTFromLocalStorage());
  const [user, setUser] = useState(getUserFromLocalStorage() || null);

  const { data: response, isSuccess } = useQuery('account', getAccount, {
    refetchOnWindowFocus: false,
    enabled: !!jwt,
    retry: false,
  });

  useEffect(() => {
    if (jwt && isSuccess) {
      setUser(() => ({
        name: response.data.name,
        roleId: response.data.role_id,
      }));
    }
  }, [isSuccess, jwt, response]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <authContext.Provider value={{ user, jwt, setJwt, setUser }}>
      {props.children}
    </authContext.Provider>
  );
};

export default authContext;
