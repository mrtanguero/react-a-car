import ourApi from '../services/ourApi.js';

export const getCarTypes = () => {
  return ourApi.get('/car-types', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};
