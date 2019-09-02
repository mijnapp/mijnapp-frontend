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

export const REQUEST_JWT_ELEVATE_WITH_PIN = 'REQUEST_JWT_ELEVATE_WITH_PIN';
export const requestJwtElevateWithPin = (pin) => ({
  type: REQUEST_JWT_ELEVATE_WITH_PIN,
  pin,
});
export const REQUEST_JWT_ELEVATE_WITH_PIN_SUCCESS =
  'REQUEST_JWT_ELEVATE_WITH_PIN_SUCCESS';
export const requestJwtElevateWithPinSuccess = (data, headers) => ({
  type: REQUEST_JWT_ELEVATE_WITH_PIN_SUCCESS,
  data,
  headers,
});
export const REQUEST_JWT_ELEVATE_WITH_PIN_FAILURE =
  'REQUEST_JWT_ELEVATE_WITH_PIN_FAILURE';
export const requestJwtElevateWithPinFailure = (error) => ({
  type: REQUEST_JWT_ELEVATE_WITH_PIN_FAILURE,
  error,
});

export const REQUEST_JWT_RENEW_WITH_PIN = 'REQUEST_JWT_RENEW_WITH_PIN';
export const requestJwtRenewWithPin = (pin) => ({
  type: REQUEST_JWT_RENEW_WITH_PIN,
  pin,
});
export const REQUEST_JWT_RENEW_WITH_PIN_SUCCESS =
  'REQUEST_JWT_RENEW_WITH_PIN_SUCCESS';
export const requestJwtRenewWithPinSuccess = (data, headers) => ({
  type: REQUEST_JWT_RENEW_WITH_PIN_SUCCESS,
  data,
  headers,
});
export const REQUEST_JWT_RENEW_WITH_PIN_FAILURE =
  'REQUEST_JWT_RENEW_WITH_PIN_FAILURE';
export const requestJwtRenewWithPinFailure = (error) => ({
  type: REQUEST_JWT_RENEW_WITH_PIN_FAILURE,
  error,
});

export const REQUEST_JWT_REFRESH = 'REQUEST_JWT_REFRESH';
export const requestJwtRefresh = () => ({ type: REQUEST_JWT_REFRESH });
export const REQUEST_JWT_REFRESH_SUCCESS = 'REQUEST_JWT_REFRESH_SUCCESS';
export const requestJwtRefreshSuccess = (data, headers) => ({
  type: REQUEST_JWT_REFRESH_SUCCESS,
  data,
  headers,
});
export const REQUEST_JWT_REFRESH_FAILURE = 'REQUEST_JWT_REFRESH_FAILURE';
export const requestJwtRefreshFailure = (error) => ({
  type: REQUEST_JWT_REFRESH_FAILURE,
  error,
});
