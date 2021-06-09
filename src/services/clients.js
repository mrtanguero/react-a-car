import ourApi from './ourApi';

export const getClients = ({ pageParam = 1 }) => {
  return ourApi.get(`/clients?page=${pageParam}`);
};
