import {
  REQUEST_AVG_LOG,
  REQUEST_AVG_LOG_SUCCESS,
  REQUEST_AVG_LOG_FAILURE,
  CLEAR_AVG_LOG,
} from '../actions/avgLog';
import { REQUEST_JWT_LOGOUT_SUCCESS } from '../actions/jwt';

export const avgLog = (state = { data: {} }, action) => {
  switch (action.type) {
    case REQUEST_AVG_LOG:
      return state;
    case REQUEST_AVG_LOG_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
      };
    case REQUEST_AVG_LOG_FAILURE:
      return { ...state, error: action.error };
    case REQUEST_JWT_LOGOUT_SUCCESS:
    case CLEAR_AVG_LOG:
      return { data: {} };
    default:
      return state;
  }
};
