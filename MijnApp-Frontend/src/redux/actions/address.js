export const REQUEST_ADDRESS_DATA = 'REQUEST_ADDRESS_DATA';
export const requestAddressData = (postalCode, number, numberAddition) => ({
  type: REQUEST_ADDRESS_DATA,
  postalCode,
  number,
  numberAddition,
});
export const REQUEST_ADDRESS_DATA_SUCCESS = 'REQUEST_ADDRESS_DATA_SUCCESS';
export const requestAddressSuccess = (data) => ({
  type: REQUEST_ADDRESS_DATA_SUCCESS,
  data,
});
export const REQUEST_ADDRESS_DATA_FAILURE = 'REQUEST_ADDRESS_DATA_FAILURE';
export const requestAddressDataFailure = (error) => ({
  type: REQUEST_ADDRESS_DATA_FAILURE,
  error,
});
export const CLEAR_ADDRESS_DATA = 'CLEAR_ADDRESS_DATA';
export const clearAddressData = () => ({ type: CLEAR_ADDRESS_DATA });
