import { call, put, takeLatest } from 'redux-saga/effects';
import { addressApi } from '../api/address';
import { xAuth } from '../helpers/headers';
import {
  REQUEST_ADDRESS_DATA,
  requestAddressSuccess,
  requestAddressDataFailure,
} from '../actions/address';

export function* watchRequestAddressData() {
  yield takeLatest(REQUEST_ADDRESS_DATA, fetchAddressData);
}

function* fetchAddressData(action) {
  try {
    const result = yield call(addressApi.address(action, xAuth()));
    yield put(requestAddressSuccess(result.data));
  } catch (e) {
    yield put(requestAddressDataFailure(e));
  }
}
