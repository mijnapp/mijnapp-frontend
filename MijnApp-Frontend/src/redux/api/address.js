import axios from 'axios';
import { BASE_URL_API } from '../store';

export const addressApi = {
  address: (token) => async () => {
    const response = await axios.get(`/adres/1058VR/170`, {
      baseURL: BASE_URL_API,
      headers: { 'X-Auth': token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  }
};
