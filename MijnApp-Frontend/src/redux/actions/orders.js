export const REQUEST_ORDERS_SUBMIT = 'REQUEST_ORDERS_SUBMIT';
export const requestOrdersSubmit = (data) => ({
  type: REQUEST_ORDERS_SUBMIT,
  data,
});

export const REQUEST_ORDERS_SUBMIT_SUCCESS = 'REQUEST_ORDERS_SUBMIT_SUCCESS';
export const requestOrdersSubmitSuccess = (data) => ({
  type: REQUEST_ORDERS_SUBMIT_SUCCESS,
  data,
});

export const REQUEST_ORDERS_SUBMIT_FAILED = 'REQUEST_ORDERS_SUBMIT_FAILED';
export const requestOrdersSubmitFailed = (error) => ({
  type: REQUEST_ORDERS_SUBMIT_FAILED,
  error,
});
export const REQUEST_ORDERS = 'REQUEST_ORDERS';
export const requestOrders = () => ({ type: REQUEST_ORDERS });
export const REQUEST_ORDERS_SUCCESS = 'REQUEST_ORDERS_SUCCESS';
export const requestOrdersSuccess = (data) => ({
  type: REQUEST_ORDERS_SUCCESS,
  data,
});
export const REQUEST_ORDERS_FAILURE = 'REQUEST_ORDERS_FAILURE';
export const requestOrdersFailure = (error) => ({
  type: REQUEST_ORDERS_FAILURE,
  error,
});
