import ourApi from './ourApi';

export const getVehicles = ({ pageParam = 1 }) => {
  return ourApi.get(`/vehicles?page=${pageParam}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
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
