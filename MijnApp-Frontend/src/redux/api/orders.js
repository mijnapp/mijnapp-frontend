import axios from 'axios';
import { configuration } from '../../helpers/configuration';

export const ordersApi = {
  submit: (data, token) => async () => {
    const response = await axios.post('/order',
      data,
      {
        baseURL: configuration.BASE_URL_API(),
        headers: { 'Authorization': 'Bearer ' + token }
      });
    if (response.statusText === 'OK' || response.status === 204) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  },
};
