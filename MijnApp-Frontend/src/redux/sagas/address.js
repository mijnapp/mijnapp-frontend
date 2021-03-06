import { call, put, takeLatest } from 'redux-saga/effects';
import { addressApi } from '../api/address';
import { jwtBearerToken } from '../helpers/headers';
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
    const result = yield call(addressApi.address(action, jwtBearerToken()));
    const address = JSON.parse(result.data).adressen;
    if (address.length > 1) {
      address.sort(sortAddress);
    }
    yield put(requestAddressSuccess(address));
  } catch (e) {
    yield put(requestAddressDataFailure(e));
  }
}

function sortAddress(a, b) {
  if (a.huisnummertoevoeging < b.huisnummertoevoeging) {
    return -1;
  }
  if (a.huisnummertoevoeging > b.huisnummertoevoeging) {
    return 1;
  }
  return 0;
}
