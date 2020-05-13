import { call, put, takeLatest } from 'redux-saga/effects';
import { ordersApi } from '../api/orders';
import {
  REQUEST_ORDERS_SUBMIT,
  requestOrdersSubmitSuccess,
  requestOrdersSubmitFailed,
  REQUEST_ORDERS,
  requestOrdersSuccess,
  requestOrdersFailure,
} from '../actions/orders';
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

export function* watchRequestOrders() {
  yield takeLatest(REQUEST_ORDERS, fetchOrders);
}

function* fetchOrders() {
  try {
    const result = yield call(ordersApi.orders(jwtBearerToken()));
    yield put(requestOrdersSuccess(result.data));
  } catch (e) {
    yield put(requestOrdersFailure(e));
  }
}
