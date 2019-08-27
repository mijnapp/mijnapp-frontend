import {
  REQUEST_ADDRESS_DATA,
  REQUEST_ADDRESS_DATA_SUCCESS,
  REQUEST_ADDRESS_DATA_FAILURE
} from '../actions/address';

export const address = (state = { data: {} }, action) => {
  switch (action.type) {
    case REQUEST_ADDRESS_DATA:
      return state;
    case REQUEST_ADDRESS_DATA_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
      };
    case REQUEST_ADDRESS_DATA_FAILURE:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
