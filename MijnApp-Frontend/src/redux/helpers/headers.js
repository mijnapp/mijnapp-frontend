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
