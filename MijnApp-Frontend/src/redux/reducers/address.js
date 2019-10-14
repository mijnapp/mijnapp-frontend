import {
  REQUEST_ADDRESS_DATA,
  REQUEST_ADDRESS_DATA_SUCCESS,
  REQUEST_ADDRESS_DATA_FAILURE,
  CLEAR_ADDRESS_DATA
} from '../actions/address';

export const address = (state = { data: {} }, action) => {
  switch (action.type) {
    case REQUEST_ADDRESS_DATA:
      return {
        ...state,
        reset: false,
        searching: true,
      };
    case REQUEST_ADDRESS_DATA_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
        reset: false,
        searching: false,
      };
    case REQUEST_ADDRESS_DATA_FAILURE:
      return {
        ...state,
        data: [],
        error: action.error,
        reset: false,
        searching: false,
      };
    case CLEAR_ADDRESS_DATA:
      return {
        data: [],
        reset: true,
        searching: false,
      };
    default:
      return state;
  }
};
