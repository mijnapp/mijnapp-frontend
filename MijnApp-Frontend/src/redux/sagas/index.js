import { all } from 'redux-saga/effects';
import { watchRequestAddressData } from './address';
import { watchRequestAvgLog } from './avgLog';
import { watchRequestAvgLogs } from './avgLogs';
import { watchRequestContract } from './contract';
import { watchRequestContracts } from './contracts';
import { watchCheckPreconditions } from './journey';
import {
  watchRequestPersonData,
  watchRequestPersonsMoving,
} from './person';
import {
  watchRequestJwtSigninFake,
  watchRequestJwtSignin,
  watchJwtSigninSuccess,
  watchJwtSigninSuccessFake,
  watchRequestJwtFromDigidCgi,
  watchRequestJwtFromDigidCgiSuccess,
  watchRequestJwtLogout,
  watchRequestJwtLogout401,
} from './jwt';
import { watchRequestOrdersSubmit } from './orders';
import { watchSelectPage, watchSelectPageNoHistory, watchNextPageAfterLogin } from './application';

export default function* rootSaga() {
  yield all([
    watchRequestAddressData(),
    watchRequestAvgLog(),
    watchRequestAvgLogs(),
    watchRequestContract(),
    watchRequestContracts(),
    watchRequestJwtSigninFake(),
    watchRequestJwtSignin(),
    watchJwtSigninSuccess(),
    watchJwtSigninSuccessFake(),
    watchRequestJwtFromDigidCgi(),
    watchRequestJwtFromDigidCgiSuccess(),
    watchRequestJwtLogout(),
    watchRequestJwtLogout401(),
    watchSelectPage(),
    watchSelectPageNoHistory(),
    watchNextPageAfterLogin(),
    watchRequestPersonData(),
    watchRequestPersonsMoving(),
    watchRequestOrdersSubmit(),
    watchCheckPreconditions(),
  ]);
}
