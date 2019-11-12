import { takeLatest, put, call } from 'redux-saga/effects';
import { store } from '../store';
import { DELETE_QUESTION_PREFLIGHT, CHECK_PRECONDITIONS, requestCheckPreconditionsSuccess, requestCheckPreconditionsFailure } from '../actions/journey';
import { journeyApi } from '../api/journey';
import { jwtBearerToken } from '../helpers/headers';
import { SET_QUESTION_TYPE, deleteQuestion } from '../actions/journey';
import { JOURNEY_END, QUESTION_TYPE_END } from '../../helpers/common';

export function* watchDeleteQuestionPreflight() {
  yield takeLatest(DELETE_QUESTION_PREFLIGHT, deleteQuestionPreflightCheck);
}

function* deleteQuestionPreflightCheck(action) {
  if (action && action.id) {
    yield put(uiDeleteDialogOpen());
    if (action.id === 'START') {
      yield put(uiDeleteDialogSetStart());
    } else {
      const state = store.getState();
      if (
        state &&
        state.journey &&
        state.journey.questions &&
        Array.isArray(state.journey.questions) &&
        state.journey.questions.length > 0
      ) {
        const q = state.journey.questions.find((i) => i.id === action.id);
        if (q) {
          let found =
            q && q.options && Array.isArray(q.options) && q.options.length > 0
              ? q.options.map((o) => (o && o.goto ? o.goto : null))
              : [];
          found.push(q.next || null);
          found.push(q.optional && q.optional.goto ? q.optional.goto : null);
          found = found
            .filter((i) => !!i)
            .filter((item, index, arr) => arr.indexOf(item) === index);
          if (found.length === 0) {
            yield put(uiDeleteDialogSetAutoResolve(action.id, null));
          } else if (found.length === 1) {
            yield put(uiDeleteDialogSetAutoResolve(action.id, found[0]));
          } else {
            yield put(uiDeleteDialogSetManualResolve(action.id, found));
          }
        }
      }
    }
  }
}

export function* watchSetQuestionType() {
  yield takeLatest(SET_QUESTION_TYPE, setQuestionTypeChecks);
}

function* setQuestionTypeChecks(action) {
  if (action.questionType === QUESTION_TYPE_END) {
    yield put(uiSidePanelClose());
    yield put(uiDeselectQuestion());
    yield put(deleteQuestion(action.id, JOURNEY_END));
  }
}

export function* watchCheckPreconditions() {
  yield takeLatest(CHECK_PRECONDITIONS, checkPreconditions);
}

function* checkPreconditions() {
  var state = store.getState();
  try {
    var jwtToken = jwtBearerToken();
    if (jwtToken === '') {
      yield put(requestCheckPreconditionsFailure('gebruiker is niet ingelogd'));
    } else {
      const result = yield call(journeyApi.checkPreconditions(state.journey.request_type_id, jwtBearerToken()));
      yield put(requestCheckPreconditionsSuccess(result.data));
    }
  } catch (e) {
    yield put(requestCheckPreconditionsFailure(e));
  }
}
