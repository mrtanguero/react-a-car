import ourApi from './ourApi';

export const getClients = ({ pageParam = 1, queryKey = [null, {}] }) => {
  const { searchTerm = '' } = queryKey[1];
  return ourApi.get(`/clients?page=${pageParam}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    params: {
      search: searchTerm,
    },
  });
};

export const createClient = (data) => {
  return ourApi.post('/user-store', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const updateClient = (data, id) => {
  return ourApi.post(`/user-update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const deleteClient = (id) => {
  return ourApi.delete(`/user-delete/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const getClient = (id) => {
  return ourApi.get(`/user-show/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};
