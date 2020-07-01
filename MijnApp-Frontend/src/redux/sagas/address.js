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
  var aHuisnummerToevoegingTrimmed = a.huisnummertoevoeging.trim();
  var bHuisnummerToevoegingTrimmed = b.huisnummertoevoeging.trim();

  if (aHuisnummerToevoegingTrimmed === '' && bHuisnummerToevoegingTrimmed === '') {
    return 0;
  }
  if (aHuisnummerToevoegingTrimmed === '' && bHuisnummerToevoegingTrimmed !== '') {
    return -1;
  }
  if (aHuisnummerToevoegingTrimmed !== '' && bHuisnummerToevoegingTrimmed === '') {
    return 1;
  }

  var aHuisnummertoevoegingLetters = aHuisnummerToevoegingTrimmed.match(/[a-zA-Z]+/g);
  var bHuisnummertoevoegingLetters = bHuisnummerToevoegingTrimmed.match(/[a-zA-Z]+/g);
  if (aHuisnummertoevoegingLetters[0] < bHuisnummertoevoegingLetters[0]) {
    return -1;
  }
  if (aHuisnummertoevoegingLetters[0] > bHuisnummertoevoegingLetters[0]) {
    return 1;
  }
  // If the letters are the same between items. Check on numbers, first check if there are any numbers.
  var aHuisnummertoevoegingNumbers = aHuisnummerToevoegingTrimmed.match(/\d+/g);
  var bHuisnummertoevoegingNumbers = bHuisnummerToevoegingTrimmed.match(/\d+/g);

  if (aHuisnummertoevoegingNumbers == null && bHuisnummertoevoegingNumbers == null) {
    return 0;
  }
  if (aHuisnummertoevoegingNumbers == null && bHuisnummertoevoegingNumbers != null) {
    return -1;
  }
  if (aHuisnummertoevoegingNumbers != null && bHuisnummertoevoegingNumbers == null) {
    return 1;
  }

  var aNumber = parseInt(aHuisnummertoevoegingNumbers[0]);
  var bNumber = parseInt(bHuisnummertoevoegingNumbers[0]);
  if (aNumber < bNumber) {
    return -1;
  }
  if (aNumber > bNumber) {
    return 1;
  }
  return 0;
}
