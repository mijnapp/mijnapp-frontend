import { call, put, takeLatest } from 'redux-saga/effects';
import { personApi } from '../api/person';
import { jwtBearerToken } from '../helpers/headers';
import {
  REQUEST_PERSON_DATA,
  requestPersonSuccess,
  requestPersonDataFailure,
  REQUEST_PERSONS_MOVING,
  requestPersonsMovingSuccess,
  requestPersonsMovingFailure,
} from '../actions/person';

export function* watchRequestPersonData() {
  yield takeLatest(REQUEST_PERSON_DATA, fetchPersonData);
}

function* fetchPersonData(action) {
  try {
    const result = yield call(personApi.person(action.id, jwtBearerToken()));
    yield put(requestPersonSuccess(result.data));
  } catch (e) {
    yield put(requestPersonDataFailure(e));
  }
}

export function* watchRequestPersonsMoving() {
  yield takeLatest(REQUEST_PERSONS_MOVING, fetchPersonsMoving);
}

function* fetchPersonsMoving() {
  try {
    const result = yield call(personApi.personsMoving(jwtBearerToken()));
    yield put(requestPersonsMovingSuccess(result.data));
  } catch (e) {
    yield put(requestPersonsMovingFailure(e));
  }
}
