import axios from 'axios';
import { BASE_URL_API } from '../store';

export const jwtApi = {
  signinfake: () => async () => {
    const response = await axios.post(
      '/jwt/signin',
      null,
      {
        baseURL: BASE_URL_API,
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      //TODO -  Here the returned token is saved in the response headers
      //        and these headers are stored in the redux store (which is stored in the localstorage)
      //        This token, however, should be stored in a safer place (and retrieved from that saver place in helpers\headers.js)
      response.headers.authorization = response.data.token;
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  },
  signin: () => async () => {
    const response = await axios.get(
      '/jwt/signin',
      {
        params: {
          frontEndRedirectTo: window.location.href + '/digidcgifinished'
        },
        baseURL: BASE_URL_API,
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  },
  elevateWithPin: (pin, token) => async () => {
    const response = await axios.post(
      '/jwt/pin',
      { pin },
      {
        baseURL: BASE_URL_API,
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  },
  renewWithPin: (pin, token) => async () => {
    const response = await axios.post(
      '/jwt/renew',
      { pin },
      {
        baseURL: BASE_URL_API,
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  },
  refresh: (token) => async () => {
    const response = await axios.get('/jwt/refresh', {
      baseURL: BASE_URL_API,
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  }
};
