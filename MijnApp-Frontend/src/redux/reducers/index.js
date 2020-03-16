import { combineReducers } from 'redux';

import * as address from './address';
import * as application from './application';
import * as avgLog from './avgLog';
import * as avgLogs from './avgLogs';
import * as contract from './contract';
import * as contracts from './contracts';
import * as journey from './journey';
import * as journeys from './journeys';
import * as jwt from './jwt';
import * as order from './order';
import * as orders from './orders';
import * as person from './person';
import * as lastAction from './lastAction';

export default combineReducers({
  ...address,
  ...application,
  ...avgLog,
  ...avgLogs,
  ...contract,
  ...contracts,
  ...journey,
  ...journeys,
  ...jwt,
  ...order,
  ...orders,
  ...person,
  ...lastAction,
});
