import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { getAccount } from '../services/account';

const getJWTFromLocalStorage = () => {
  return localStorage.getItem('jwt');
};

const authContext = React.createContext({
  user: {},
  jwt: '',
  setJwt: () => {},
});

export const AuthProvider = (props) => {
  const [jwt, setJwt] = useState(getJWTFromLocalStorage());
  const [user, setUser] = useState(null);
  const history = useHistory();

  const { data: response, isSuccess, error } = useQuery('account', getAccount, {
    refetchOnWindowFocus: false,
    enabled: !!jwt,
  });

  if (error && jwt) {
    localStorage.removeItem('jwt');
    setJwt('');
    setUser(null);
    history.replace('/login');
  }

  useEffect(() => {
    if (jwt && isSuccess) {
      setUser({
        name: response.data.name,
        roleId: response.data.role_id,
      });
    }
  }, [jwt, response?.data, isSuccess]);

  return (
    <authContext.Provider value={{ user, jwt, setJwt, setUser }}>
      {props.children}
    </authContext.Provider>
  );
};

export default authContext;
