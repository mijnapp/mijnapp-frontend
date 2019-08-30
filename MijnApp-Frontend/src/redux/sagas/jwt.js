import { call, put, takeLatest } from 'redux-saga/effects';
import { jwtApi } from '../api/jwt';
import { xAuth } from '../helpers/headers';
import { selectPage } from '../actions/application';
import {
  REQUEST_JWT_SIGNIN_FAKE,
  REQUEST_JWT_SIGNIN,
  requestJwtSigninSuccessFake,
  requestJwtSigninSuccess,
  requestJwtSigninFailure,
  REQUEST_JWT_SIGNIN_SUCCESS,
  REQUEST_JWT_SIGNIN_SUCCESS_FAKE,
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

export function* watchRequestJwtElevateWithPin() {
  yield takeLatest(REQUEST_JWT_ELEVATE_WITH_PIN, fetchJwtElevateWithPin);
}

function* fetchJwtElevateWithPin(action) {
  try {
    const result = yield call(jwtApi.elevateWithPin(action.pin, xAuth()));
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
    const result = yield call(jwtApi.renewWithPin(action.pin, xAuth()));
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
    const result = yield call(jwtApi.refresh(xAuth()));
    yield put(requestJwtRefreshSuccess(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtRefreshFailure(e));
  }
}
