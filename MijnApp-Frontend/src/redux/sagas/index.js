import { all } from 'redux-saga/effects';
import { watchRequestAddressData } from './address';
import { watchRequestAvgLog } from './avgLog';
import { watchRequestAvgLogs } from './avgLogs';
import { watchRequestContract } from './contract';
import { watchRequestContracts } from './contracts';
import { watchRequestPersonData } from './person';
import {
  watchRequestJwtSigninFake,
  watchRequestJwtSignin,
  watchJwtSigninSuccess,
  watchJwtSigninSuccessFake,
  watchRequestJwtFromDigidCgi,
  watchRequestJwtFromDigidCgiSuccess,
  watchRequestJwtLogout,
  watchRequestJwtElevateWithPin,
  watchRequestJwtRenewWithPin,
  watchRequestJwtRefresh,
} from './jwt';
import {
  watchRequestOrdersList,
  watchRequestOrdersItem,
  watchRequestOrdersSubmit,
} from './orders';
import { watchSelectPage, watchSelectPageNoHistory } from './application';
import {
  watchRequestOAuthInit,
  watchRequestOAuthInitSuccess,
  watchRequestOAuthHandle,
  watchRequestOAuthHandleSuccess,
} from './oauth';

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
    watchRequestJwtElevateWithPin(),
    watchRequestJwtRenewWithPin(),
    watchRequestJwtRefresh(),
    watchSelectPage(),
    watchSelectPageNoHistory(),
    watchRequestPersonData(),
    watchRequestOrdersList(),
    watchRequestOrdersItem(),
    watchRequestOrdersSubmit(),
    watchRequestOAuthInit(),
    watchRequestOAuthInitSuccess(),
    watchRequestOAuthHandle(),
    watchRequestOAuthHandleSuccess(),
  ]);
}
