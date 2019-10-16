import {
  REQUEST_JWT_SIGNIN_FAKE,
  REQUEST_JWT_SIGNIN,
  REQUEST_JWT_LOGOUT,
  REQUEST_JWT_LOGOUT_401,
  REQUEST_JWT_LOGOUT_SUCCESS,
  REQUEST_JWT_SIGNIN_SUCCESS_FAKE,
  REQUEST_JWT_SIGNIN_SUCCESS,
  REQUEST_JWT_SIGNIN_FAILURE,
  REQUEST_JWT_FOR_DIGIDCGI,
  REQUEST_JWT_FOR_DIGIDCGI_SUCCESS,
  REQUEST_JWT_FOR_DIGIDCGI_FAILURE,
} from '../actions/jwt';

export const jwt = (state = { data: {}, headers: {} }, action) => {
  switch (action.type) {
    case REQUEST_JWT_SIGNIN_FAKE:
      return state;
    case REQUEST_JWT_SIGNIN:
    case REQUEST_JWT_LOGOUT:
      return state;
    case REQUEST_JWT_LOGOUT_401:
      return {
        ...state,
        lastActionBefore401: action.lastActionBefore401,
      };
    case REQUEST_JWT_SIGNIN_SUCCESS:
    case REQUEST_JWT_SIGNIN_SUCCESS_FAKE:
      return {
        ...state,
        data: { ...state.data, ...action.data },
        headers: { ...state.headers, ...action.headers },
        error: null,
      };
    case REQUEST_JWT_SIGNIN_FAILURE:
      return { ...state, error: action.error };
    case REQUEST_JWT_FOR_DIGIDCGI:
      return state;
    case REQUEST_JWT_FOR_DIGIDCGI_SUCCESS:
      return {
        ...state,
        provider: 'digidcgi',
        data: { ...state.data, ...action.data },
        headers: { ...state.headers, ...action.headers },
        error: null,
      };
    case REQUEST_JWT_FOR_DIGIDCGI_FAILURE:
      return { ...state, error: action.error };
    case REQUEST_JWT_LOGOUT_SUCCESS:
      return { data: {}, headers: {} };
    default:
      return state;
  }
};
