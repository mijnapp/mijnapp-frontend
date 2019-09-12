import { call, put, takeLatest } from 'redux-saga/effects';
import { ordersApi } from '../api/orders';
import { REQUEST_ORDERS_SUBMIT, requestOrdersSubmitSuccess, requestOrdersSubmitFailed } from '../actions/orders';
import { jwtBearerToken } from '../helpers/headers';

export function* watchRequestOrdersSubmit() {
  yield takeLatest(REQUEST_ORDERS_SUBMIT, fetchOrdersSubmit);
}

function* fetchOrdersSubmit(action) {
  try {
    const result = yield call(ordersApi.submit(action.data, jwtBearerToken()));
    yield put(requestOrdersSubmitSuccess(result.data));
  } catch (e) {
    yield put(requestOrdersSubmitFailed(e));
  }
}
