import axios from 'axios';
import { BASE_URL_API } from '../store';

export const personApi = {
  person: (id, token) => async () => {
    const response = await axios.get(`/person/${id}`, {
      baseURL: BASE_URL_API,
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  }
};
