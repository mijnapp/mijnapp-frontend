import { store } from '../store';
const tokenStorageKey = 'mijnApp-JwtToken';

export const setJwtBearerToken = (jwtToken) => {
  window.sessionStorage.setItem(tokenStorageKey, jwtToken);
};

export const removeJwtBearerToken = () => {
  window.sessionStorage.removeItem(tokenStorageKey);
};

export const jwtBearerToken = () => {
  const jwtToken = window.sessionStorage.getItem(tokenStorageKey);
  return jwtToken ? jwtToken : '';
};

export const jwtBearerTokenExists = () => {
  const jwtToken = window.sessionStorage.getItem(tokenStorageKey);

  return jwtToken ? true : false;
};

export const getProcessId = () => {
  var journey = store.getState().journey;
  if (journey !== undefined &&
    journey !== null &&
    journey.request_type_id !== undefined &&
    journey.request_type_id !== null) {
    return journey.request_type_id;
  }
  return '';
};
