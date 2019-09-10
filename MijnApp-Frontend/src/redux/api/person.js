import axios from 'axios';
import { configuration } from '../../helpers/configuration';

export const personApi = {
  person: (id, token) => async () => {
    const response = await axios.get(`/person/${id}`, {
      baseURL: configuration.BASE_URL_API(),
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  },
  personsMoving: (token) => async () => {
    const response = await axios.get(`/personsMoving`, {
      baseURL: configuration.BASE_URL_API(),
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  },
};
