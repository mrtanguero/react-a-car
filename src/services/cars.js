import ourApi from './ourApi';

export const getVehicles = ({ pageParam = 1, queryKey }) => {
  const { searchTerm } = queryKey[1];
  return ourApi.get(`/vehicles?page=${pageParam}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    params: {
      search: searchTerm,
    },
  });
};

export const createVehicle = (data) => {
  return ourApi.post('/vehicle', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const updateVehicle = (data, id) => {
  return ourApi.post(`/vehicle-update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const deleteVehicle = (id) => {
  return ourApi.delete(`/vehicle-delete/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const getVehicle = (id) => {
  return ourApi.get(`/vehicle-show/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const deletePhoto = (id) => {
  return ourApi.delete(`/photo-delete/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const getAvailableVehicles = ({ pageParam = 1, queryKey }) => {
  const { dateFrom, dateTo, carType } = queryKey[1];
  return ourApi.get('/cars-available', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    params: {
      page: pageParam,
      start_date: dateFrom,
      end_date: dateTo,
      car_type: carType,
    },
  });
};
