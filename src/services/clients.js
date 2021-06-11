import ourApi from './ourApi';

export const getClients = ({ pageParam = 1 }) => {
  return ourApi.get(`/clients?page=${pageParam}`, {
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
