import { call, put, takeLatest } from 'redux-saga/effects';
import { jwtApi } from '../api/jwt';
import { jwtBearerToken, removeJwtBearerToken } from '../helpers/headers';
import { selectPage, selectPageNoHistory, nextPageAfterLogin } from '../actions/application';
import { clearState } from '../saver';
import { setLastAction, removeLastAction } from '../helpers/lastAction';

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
  yield put(nextPageAfterLogin());
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
  yield put(nextPageAfterLogin());
}

export function* watchRequestJwtLogout() {
  yield takeLatest(REQUEST_JWT_LOGOUT, doJwtLogout);
}

function* doJwtLogout() {
  yield call(jwtApi.logout(jwtBearerToken()));
  clearState();
  removeJwtBearerToken();
  removeLastAction();
  window.successToast.text = 'Succesvol uitgelogd';
  window.successToast.open();
  yield put(selectPage('signin'));
}

export function* watchRequestJwtLogout401() {
  yield takeLatest(REQUEST_JWT_LOGOUT_401, doJwtLogout401);
}

function* doJwtLogout401(action) {
  removeJwtBearerToken();
  if (action && action.lastActionBefore401) {
    setLastAction(action.lastActionBefore401);
  }
  window.clearErrorDialog();
  window.errorText.innerHTML = `U heeft geen geldige sessie meer en zult opnieuw moeten inloggen.`;
  window.errorDialog.open();
  // Here we do a selectPageNoHistory, so that when the user logs in again, he is navigated to were he was.
  yield put(selectPageNoHistory('signin'));
}
