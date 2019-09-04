import {
  REQUEST_JWT_SIGNIN_FAKE,
  REQUEST_JWT_SIGNIN,
  REQUEST_JWT_LOGOUT,
  REQUEST_JWT_LOGOUT_401,
  REQUEST_JWT_SIGNIN_SUCCESS_FAKE,
  REQUEST_JWT_SIGNIN_SUCCESS,
  REQUEST_JWT_SIGNIN_FAILURE,
  REQUEST_JWT_FOR_DIGIDCGI,
  REQUEST_JWT_FOR_DIGIDCGI_SUCCESS,
  REQUEST_JWT_FOR_DIGIDCGI_FAILURE,
  REQUEST_JWT_ELEVATE_WITH_PIN,
  REQUEST_JWT_ELEVATE_WITH_PIN_SUCCESS,
  REQUEST_JWT_ELEVATE_WITH_PIN_FAILURE,
  REQUEST_JWT_RENEW_WITH_PIN,
  REQUEST_JWT_RENEW_WITH_PIN_SUCCESS,
  REQUEST_JWT_RENEW_WITH_PIN_FAILURE,
  REQUEST_JWT_REFRESH,
  REQUEST_JWT_REFRESH_SUCCESS,
  REQUEST_JWT_REFRESH_FAILURE,
} from '../actions/jwt';
import {
  REQUEST_OAUTH_HANDLE_SUCCESS,
} from '../actions/oauth';

export const jwt = (state = { data: {}, headers: {} }, action) => {
  switch (action.type) {
    case REQUEST_JWT_SIGNIN_FAKE:
      return state;
    case REQUEST_JWT_SIGNIN:
    case REQUEST_JWT_LOGOUT:
    case REQUEST_JWT_LOGOUT_401:
      return state;
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
    case REQUEST_JWT_ELEVATE_WITH_PIN:
      return state;
    case REQUEST_JWT_ELEVATE_WITH_PIN_SUCCESS:
      return {
        ...state,
        data: { ...state.data, ...action.data },
        headers: { ...state.headers, ...action.headers },
        error: null,
      };
    case REQUEST_JWT_ELEVATE_WITH_PIN_FAILURE:
      return { ...state, error: action.error };
    case REQUEST_JWT_RENEW_WITH_PIN:
      return state;
    case REQUEST_JWT_RENEW_WITH_PIN_SUCCESS:
      return {
        ...state,
        data: { ...state.data, ...action.data },
        headers: { ...state.headers, ...action.headers },
        error: null,
      };
    case REQUEST_JWT_RENEW_WITH_PIN_FAILURE:
      return { ...state, error: action.error };
    case REQUEST_JWT_REFRESH:
      return state;
    case REQUEST_JWT_REFRESH_SUCCESS:
      return {
        ...state,
        data: { ...state.data, ...action.data },
        headers: { ...state.headers, ...action.headers },
        error: null,
      };
    case REQUEST_JWT_REFRESH_FAILURE:
      return { ...state, error: action.error };
    case REQUEST_OAUTH_HANDLE_SUCCESS:
      return {
        ...state,
        data: { ...state.data, ...action.data },
        headers: { ...state.headers, ...action.headers },
        error: null,
      };
    default:
      return state;
  }
};
