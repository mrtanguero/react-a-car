import axios from 'axios';
import { BASE_URL } from '../config/config';

const ourApi = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export default ourApi;
