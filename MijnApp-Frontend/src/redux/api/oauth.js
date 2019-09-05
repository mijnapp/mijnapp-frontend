import axios from 'axios';
import { configuration } from '../../helpers/configuration';

export const oauthApi = {
  init: (provider) => async () => {
    const response = await axios.get(`/oauth/init/${provider}`, {
      baseURL: configuration.BASE_URL_API(),
      params: {
        appName: 'mijn-app',
      },
    });
    if (response.statusText === 'No Content' || response.status === 204) {
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  },
  handle: (code, stateToken, provider) => async () => {
    const response = await axios.get(`/oauth/handle/${provider}`, {
      baseURL: configuration.BASE_URL_API(),
      params: {
        code: code,
        state_token: stateToken,
      },
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  },
};
