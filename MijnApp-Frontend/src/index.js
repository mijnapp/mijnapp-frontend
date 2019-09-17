'use strict';

/* Import WebpackApp */

/* eslint-disable no-unused-vars */
import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/polymer/lib/elements/dom-repeat';
import '@polymer/polymer/lib/elements/array-selector';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-toast/paper-toast.js';

import './components/application/maf-app';

import { store } from './redux/store';

// NOTE: service worker not enabled.
// import sw from './sw-loader';

// NOTE: service worker not enabled.
// sw();
import axios from 'axios';
axios.defaults.withCredentials = true;

import {
  requestJwtLogoutUnauthorized,
} from './redux/actions/jwt';

axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    var actionLeadingTo401 = store.getState().lastAction;
    store.dispatch(requestJwtLogoutUnauthorized(actionLeadingTo401));
  }
  return Promise.reject(error);
});
