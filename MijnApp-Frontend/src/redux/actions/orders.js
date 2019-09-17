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
