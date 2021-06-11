import ourApi from './ourApi';

export const getCountries = () => {
  return ourApi.get('/countries', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};
