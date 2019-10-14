import {
  REQUEST_CONTRACTS,
  REQUEST_CONTRACTS_SUCCESS,
  REQUEST_CONTRACTS_FAILURE,
} from '../actions/contracts';
import { REQUEST_JWT_LOGOUT_SUCCESS } from '../actions/jwt';

export const contracts = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_CONTRACTS:
      return state;
    case REQUEST_CONTRACTS_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
      };
    case REQUEST_CONTRACTS_FAILURE:
      return { ...state, error: action.error };
    case REQUEST_JWT_LOGOUT_SUCCESS:
      return { data: [] };
    default:
      return state;
  }
};
