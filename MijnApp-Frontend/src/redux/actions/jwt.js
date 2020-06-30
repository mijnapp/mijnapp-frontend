export const REQUEST_JWT_SIGNIN_FAKE = 'REQUEST_JWT_SIGNIN_FAKE';
export const requestJwtSigninFake = () => ({
  type: REQUEST_JWT_SIGNIN_FAKE,
});
export const REQUEST_JWT_SIGNIN_SUCCESS_FAKE = 'REQUEST_JWT_SIGNIN_SUCCESS_FAKE';
export const requestJwtSigninSuccessFake = (data, headers) => ({
  type: REQUEST_JWT_SIGNIN_SUCCESS_FAKE,
  data,
  headers,
});
export const REQUEST_JWT_SIGNIN = 'REQUEST_JWT_SIGNIN';
export const requestJwtSignin = () => ({
  type: REQUEST_JWT_SIGNIN,
});
export const REQUEST_JWT_SIGNIN_SUCCESS = 'REQUEST_JWT_SIGNIN_SUCCESS';
export const requestJwtSigninSuccess = (data, headers) => ({
  type: REQUEST_JWT_SIGNIN_SUCCESS,
  data,
  headers,
});
export const REQUEST_JWT_SIGNIN_FAILURE = 'REQUEST_JWT_SIGNIN_FAILURE';
export const requestJwtSigninFailure = (error) => ({
  type: REQUEST_JWT_SIGNIN_FAILURE,
  error,
});
export const REQUEST_JWT_FOR_DIGIDCGI = 'REQUEST_JWT_FOR_DIGIDCGI';
export const requestJwtTokenForDigidCgi = (aselectCredentials, rid) => ({
  type: REQUEST_JWT_FOR_DIGIDCGI,
  aselectCredentials,
  rid
});
export const REQUEST_JWT_FOR_DIGIDCGI_SUCCESS = 'REQUEST_JWT_FOR_DIGIDCGI_SUCCESS';
export const requestJwtTokenForDigidSuccess = (data, headers) => ({
  type: REQUEST_JWT_FOR_DIGIDCGI_SUCCESS,
  data,
  headers,
});
export const REQUEST_JWT_FOR_DIGIDCGI_FAILURE = 'REQUEST_JWT_FOR_DIGIDCGI_FAILURE';
export const requestJwtTokenForDigidFailure = (error) => ({
  type: REQUEST_JWT_FOR_DIGIDCGI_FAILURE,
  error,
});
export const REQUEST_JWT_LOGOUT = 'REQUEST_JWT_LOGOUT';
export const requestJwtLogout = (returnUrl) => ({
  type: REQUEST_JWT_LOGOUT,
  returnUrl: returnUrl,
});
export const REQUEST_JWT_LOGOUT_401 = 'REQUEST_JWT_LOGOUT_401';
export const requestJwtLogoutUnauthorized = (lastAction) => ({
  type: REQUEST_JWT_LOGOUT_401,
  lastActionBefore401: lastAction,
});
export const REQUEST_JWT_LOGOUT_SUCCESS = 'REQUEST_JWT_LOGOUT_SUCCESS';
export const requestJwtLogoutSuccess = () => ({
  type: REQUEST_JWT_LOGOUT_SUCCESS,
});
