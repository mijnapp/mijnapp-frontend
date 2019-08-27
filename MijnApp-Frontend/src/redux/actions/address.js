export const REQUEST_ADDRESS_DATA = 'REQUEST_ADDRESS_DATA';
export const requestAddressData = (id) => ({ type: REQUEST_ADDRESS_DATA, id });
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
