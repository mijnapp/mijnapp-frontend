import axios from 'axios';
import { configuration } from '../../helpers/configuration';
import { setJwtBearerToken } from '../helpers/headers';

export const jwtApi = {
  signinfake: () => async () => {
    const response = await axios.post(
      '/jwt/signinfake',
      null,
      {
        baseURL: configuration.BASE_URL_API(),
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      setJwtBearerToken(response.data.token);
      delete response.data.token;
      window.successToast.text = 'Succesvol ingelogd';
      window.successToast.open();
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
      window.successToast.text = 'Succesvol ingelogd';
      window.successToast.open();
      return { data: response.data, headers: response.headers };
    } else {
      throw response.status;
    }
  },
  logout: (token) => async () => {
    const response = await axios.post(
      '/jwt/signout',
      null,
      {
        baseURL: configuration.BASE_URL_API(),
        headers: { 'Authorization': 'Bearer ' + token }
      }
    );
    if (response.statusText === 'OK' || response.status === 200) {
      var simpleLogoutUrl = response.data.simpleLogoutUrl;
      if (simpleLogoutUrl !== null && simpleLogoutUrl !== '') {
        await axios.get(simpleLogoutUrl, null);
      }
    } else {
      throw response.status;
    }
  },
};
