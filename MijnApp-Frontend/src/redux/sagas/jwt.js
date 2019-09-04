import { call, put, takeLatest } from 'redux-saga/effects';
import { jwtApi } from '../api/jwt';
import { jwtBearerToken, removeJwtBearerToken } from '../helpers/headers';
import { selectPage } from '../actions/application';
import {
  REQUEST_JWT_SIGNIN_FAKE,
  REQUEST_JWT_SIGNIN,
  requestJwtSigninSuccessFake,
  requestJwtSigninSuccess,
  requestJwtSigninFailure,
  REQUEST_JWT_LOGOUT,
  REQUEST_JWT_LOGOUT_401,
  REQUEST_JWT_SIGNIN_SUCCESS,
  REQUEST_JWT_SIGNIN_SUCCESS_FAKE,
  REQUEST_JWT_FOR_DIGIDCGI, REQUEST_JWT_FOR_DIGIDCGI_SUCCESS,
  requestJwtTokenForDigidSuccess, requestJwtTokenForDigidFailure,
  REQUEST_JWT_ELEVATE_WITH_PIN,
  requestJwtElevateWithPinSuccess,
  requestJwtElevateWithPinFailure,
  REQUEST_JWT_RENEW_WITH_PIN,
  requestJwtRenewWithPinSuccess,
  requestJwtRenewWithPinFailure,
  REQUEST_JWT_REFRESH,
  requestJwtRefreshSuccess,
  requestJwtRefreshFailure,
} from '../actions/jwt';


export function* watchRequestJwtSigninFake() {
  yield takeLatest(REQUEST_JWT_SIGNIN_FAKE, fetchJwtSigninFake);
}

function* fetchJwtSigninFake() {
  try {
    const result = yield call(jwtApi.signinfake());
    yield put(requestJwtSigninSuccessFake(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtSigninFailure(e));
  }
}

export function* watchRequestJwtSignin() {
  yield takeLatest(REQUEST_JWT_SIGNIN, fetchJwtSignin);
}

function* fetchJwtSignin() {
  try {
    const result = yield call(jwtApi.signin());
    yield put(requestJwtSigninSuccess(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtSigninFailure(e));
  }
}

export function* watchJwtSigninSuccess() {
  yield takeLatest(REQUEST_JWT_SIGNIN_SUCCESS, onJwtSigninSuccess);
}

export function* watchJwtSigninSuccessFake() {
  yield takeLatest(REQUEST_JWT_SIGNIN_SUCCESS_FAKE, onJwtSigninSuccessFake);
}

function onJwtSigninSuccess(action) {
  window.location = action.data.redirectTo;
}

function* onJwtSigninSuccessFake() {
  yield put(selectPage('home'));
}

export function* watchRequestJwtFromDigidCgi() {
  yield takeLatest(REQUEST_JWT_FOR_DIGIDCGI, fetchJwtFromDigidCgi);
}

function* fetchJwtFromDigidCgi(action) {
  try {
    const result = yield call(jwtApi.getJwtForDigidCgi(action.aselectCredentials, action.rid));
    yield put(requestJwtTokenForDigidSuccess(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtTokenForDigidFailure(e));
  }
}

export function* watchRequestJwtFromDigidCgiSuccess() {
  yield takeLatest(REQUEST_JWT_FOR_DIGIDCGI_SUCCESS, onJwtFromDigidCgiSuccess);
}

function* onJwtFromDigidCgiSuccess() {
  yield put(selectPage('home'));
}

export function* watchRequestJwtLogout() {
  yield takeLatest(REQUEST_JWT_LOGOUT, doJwtLogout);
}

function* doJwtLogout() {
  removeJwtBearerToken();

  successToast.text = 'Succesvol uitgelogd';
  successToast.open();
  yield put(selectPage('signin'));
}

export function* watchRequestJwtLogout401() {
  yield takeLatest(REQUEST_JWT_LOGOUT_401, doJwtLogout401);
}

function* doJwtLogout401() {
  removeJwtBearerToken();
  clearErrorDialog();
  errorText.innerHTML = `U heeft geen geldige sessie meer en zult opnieuw moeten inloggen.`;
  errorDialog.open();

  yield put(selectPage('signin'));
}

export function* watchRequestJwtElevateWithPin() {
  yield takeLatest(REQUEST_JWT_ELEVATE_WITH_PIN, fetchJwtElevateWithPin);
}

function* fetchJwtElevateWithPin(action) {
  try {
    const result = yield call(jwtApi.elevateWithPin(action.pin, jwtBearerToken()));
    yield put(requestJwtElevateWithPinSuccess(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtElevateWithPinFailure(e));
  }
}

export function* watchRequestJwtRenewWithPin() {
  yield takeLatest(REQUEST_JWT_RENEW_WITH_PIN, fetchJwtRenewWithPin);
}

function* fetchJwtRenewWithPin(action) {
  try {
    const result = yield call(jwtApi.renewWithPin(action.pin, jwtBearerToken()));
    yield put(requestJwtRenewWithPinSuccess(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtRenewWithPinFailure(e));
  }
}

export function* watchRequestJwtRefresh() {
  yield takeLatest(REQUEST_JWT_REFRESH, fetchJwtRefresh);
}

function* fetchJwtRefresh() {
  try {
    const result = yield call(jwtApi.refresh(jwtBearerToken()));
    yield put(requestJwtRefreshSuccess(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtRefreshFailure(e));
  }
}
