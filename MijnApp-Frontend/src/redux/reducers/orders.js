import {
  REQUEST_ORDERS,
  REQUEST_ORDERS_SUCCESS,
  REQUEST_ORDERS_FAILURE,
} from '../actions/orders';
import { REQUEST_JWT_LOGOUT_SUCCESS } from '../actions/jwt';

export const orders = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_ORDERS:
    return {
      ...state,
      searching: true,
      status: REQUEST_ORDERS,
    };
    case REQUEST_ORDERS_SUCCESS:
    return {
      ...state,
      searching: false,
      data: action.data,
      error: null,
    };
    case REQUEST_ORDERS_FAILURE:
      return {
        ...state,
        searching: false,
        error: action.error
      };
  case REQUEST_JWT_LOGOUT_SUCCESS:
    return { data: [] };
  default:
    return state;
  }
};
