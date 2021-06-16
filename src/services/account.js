import ourApi from './ourApi.js';

export const login = (user) => {
  return ourApi.post('/auth/login', user);
};

export const getAccount = () => {
  return ourApi.post(
    '/auth/me',
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }
  );
};

export const logout = () => {
  return ourApi.post(
    '/auth/logout',
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }
  );
};

export const changePassword = (data) => {
  return ourApi.post('/auth/change-password', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};
