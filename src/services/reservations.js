import ourApi from './ourApi';

export const getReservations = ({ pageParam = 1 }) => {
  return ourApi.get(`/reservations?page=${pageParam}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const createReservation = (data) => {
  return ourApi.post('/reservation-store', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const updateReservation = (data, id) => {
  return ourApi.post(`/reservation-update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const deleteReservation = (id) => {
  return ourApi.delete(`/reservation-delete/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const getReservation = (id) => {
  return ourApi.get(`/reservation-show/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const getLocations = () => {
  return ourApi.get('/locations', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};

export const getEquipment = () => {
  return ourApi.get('/equipment', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
  });
};
