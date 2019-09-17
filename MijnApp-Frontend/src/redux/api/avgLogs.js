import axios from 'axios';
import { configuration } from '../../helpers/configuration';

export const avgLogsApi = {
  avgLogs: (token) => async () => {
    const response = await axios.get('/avglogs', {
      baseURL: configuration.BASE_URL_API(),
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  },
  avgLog: (id, token) => async () => {
    const response = await axios.get(`/avglogs/${id}`, {
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
