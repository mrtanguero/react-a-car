import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
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

  const { data: response, isSuccess, error } = useQuery('account', getAccount, {
    refetchOnWindowFocus: false,
    enabled: !!jwt,
  });

  if (error) {
    localStorage.removeItem('jwt');
    setJwt('');
    setUser(null);
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
