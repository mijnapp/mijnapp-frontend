import {
  REQUEST_CONTRACT,
  REQUEST_CONTRACT_SUCCESS,
  REQUEST_CONTRACT_FAILURE,
  CLEAR_CONTRACT,
} from '../actions/contract';
import { REQUEST_JWT_LOGOUT_SUCCESS } from '../actions/jwt';

export const contract = (state = { data: {} }, action) => {
  switch (action.type) {
    case REQUEST_CONTRACT:
      return state;
    case REQUEST_CONTRACT_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
      };
    case REQUEST_CONTRACT_FAILURE:
      return { ...state, error: action.error };
    case REQUEST_JWT_LOGOUT_SUCCESS:
    case CLEAR_CONTRACT:
      return { data: {} };
    default:
      return state;
  }
};
