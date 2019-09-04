export const setJwtBearerToken = (jwtToken) => {
  window.sessionStorage.setItem('mijnApp-JwtToken', jwtToken);
};

export const removeJwtBearerToken = () => {
  window.sessionStorage.removeItem('mijnApp-JwtToken');
};

export const jwtBearerToken = () => {
  const jwtToken = window.sessionStorage.getItem('mijnApp-JwtToken');
  return jwtToken ? jwtToken : '';
};

export const jwtBearerTokenExists = () => {
  const jwtToken = window.sessionStorage.getItem('mijnApp-JwtToken');

  return jwtToken ? true : false;
};
