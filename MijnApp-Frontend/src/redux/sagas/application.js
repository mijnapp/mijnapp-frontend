import { call, put, takeLatest } from 'redux-saga/effects';
import { SELECT_PAGE, SELECT_PAGE_NO_HISTORY, NEXT_PAGE_AFTER_LOGIN, selectPage, selectPageNoHistory } from '../actions/application';
import { store } from '../store';
import { clearContract } from '../actions/contract';
import { jwtBearerTokenExists } from '../helpers/headers';
import { setLastPage, getLastPage, removeLastPage } from '../helpers/lastPage';
import { getLastAction, removeLastAction } from '../helpers/lastAction';

export function* watchSelectPage() {
  yield takeLatest(SELECT_PAGE, pageSelected);
}

function* pageSelected(action) {
  if (action.page !== 'signin' && !jwtBearerTokenExists()) {
    yield put(selectPageNoHistory('signin'));
  }
  yield call(scrollToTop());
  yield call(setHistory(action.page, action.page, action.page));
  let state = store.getState();
  if (
    action.page !== 'contract' &&
    (state && state.contract && state.contract.data && state.contract.data.id)
  ) {
    yield put(clearContract());
  }
}

export function* watchSelectPageNoHistory() {
  yield takeLatest(SELECT_PAGE_NO_HISTORY, pageSelectedNoHistory);
}

function* pageSelectedNoHistory(action) {
  if (action.page !== 'signin' && !jwtBearerTokenExists()) {
    yield put(selectPageNoHistory('signin'));
  }
  yield call(scrollToTop());
}

const scrollToTop = () => async () => {
  window.scrollTo(0, 0);
};

const setHistory = (state, title, url) => async () => {
  history.pushState(state, title, url);
  var lastState = { 'state': state, 'title': title, 'url': url };
  setLastPage(lastState);
}

export function* watchNextPageAfterLogin() {
  yield takeLatest(NEXT_PAGE_AFTER_LOGIN, nextPageAfterLogin);
}

function* nextPageAfterLogin() {
  //Try to move to the last known page. If that is not available, just navigate home
  var lastPageBefore401 = getLastPage();
  
  if (lastPageBefore401 && lastPageBefore401.state && lastPageBefore401.state !== 'signin') {
    removeLastPage();
    yield put(selectPage(lastPageBefore401.state));

    //Now also try to replay the last action before the 401 occured.
    var lastActionBefore401 = getLastAction();
    if (lastActionBefore401) {
      removeLastAction();
      yield put(lastActionBefore401);
    }
  } else {
    yield put(selectPage('home'));
  }
  yield call(scrollToTop());
}
