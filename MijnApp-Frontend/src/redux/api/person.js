import axios from 'axios';
import { configuration } from '../../helpers/configuration';
import { getProcessId } from '../helpers/headers';

export const personApi = {
  person: (token) => async () => {
    const response = await axios.get(`/person`, {
      baseURL: configuration.BASE_URL_API(),
      headers: {
        'Authorization': 'Bearer ' + token,
        'X-NLX-Request-Process-Id': getProcessId()
      }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  },
  personsMoving: (token) => async () => {
    const response = await axios.get(`/familyfirstgrade`, {
      baseURL: configuration.BASE_URL_API(),
      headers: {
        'Authorization': 'Bearer ' + token,
        'X-NLX-Request-Process-Id': getProcessId()
      }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  },
};
