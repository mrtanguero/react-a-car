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

  const { data: response, isSuccess } = useQuery('account', getAccount, {
    refetchOnWindowFocus: false,
    enabled: !!jwt,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser({
        name: response.data.name,
        roleId: response.data.role_id,
      });
    }
  }, [isSuccess, response.data]);

  return (
    <authContext.Provider value={{ user, jwt, setJwt }}>
      {props.children}
    </authContext.Provider>
  );
};

export default authContext;
