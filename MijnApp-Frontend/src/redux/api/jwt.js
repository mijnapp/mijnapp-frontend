import axios from 'axios';
import { configuration } from '../../helpers/configuration';
import { setJwtBearerToken } from '../helpers/headers';

export const jwtApi = {
  signinfake: () => async () => {
    const response = await axios.post(
      '/jwt/signin',
      null,
      {
        baseURL: configuration.BASE_URL_API(),
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      setJwtBearerToken(response.data.token);
      delete response.data.token;
      successToast.text = "Succesvol ingelogd";
      successToast.open();
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
          frontEndRedirectTo: window.location.origin + '/digidcgifinished'
        },
        baseURL: configuration.BASE_URL_API(),
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  },
  getJwtForDigidCgi: (aselectCredentials, rid) => async () => {
    const response = await axios.post(
      '/jwt/getJwtForDigidCgi',
      null,
      {
        baseURL: configuration.BASE_URL_API(),
        params: {
          aselectCredentials: aselectCredentials,
          rid: rid
        }
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      setJwtBearerToken(response.data.token);
      delete response.data.token;
      successToast.text = "Succesvol ingelogd";
      successToast.open();
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
        baseURL: configuration.BASE_URL_API(),
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
        baseURL: configuration.BASE_URL_API(),
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
      baseURL: configuration.BASE_URL_API(),
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  }
};
