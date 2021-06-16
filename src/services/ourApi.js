import axios from 'axios';

const ourApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  // baseURL: 'http://akademija-api.proserver.me/api',
});

export default ourApi;
