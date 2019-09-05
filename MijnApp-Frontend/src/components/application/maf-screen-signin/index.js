import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { store, HAS_FAKE_INLOG_ENABLED } from '../../../redux/store';
import { requestJwtSigninFake } from '../../../redux/actions/jwt';
import { requestJwtSignin } from '../../../redux/actions/jwt';
import { requestOAuthInit } from '../../../redux/actions/oauth';
import { connect } from 'pwa-helpers/connect-mixin';

import css from './style.pcss';
import template from './template.html';
import '@polymer/paper-input/paper-input';

export default class MafScreenSignin extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      username: {
        type: String,
        value: '',
      },
      password: {
        type: String,
        value: '',
      },
      validated: {
        type: Boolean,
        value: false,
      },
      continue: {
        type: Function,
        value: () => () => {
          console.warn('No continune function set for app-login.');
        },
      },
      hasFakeInlogEnabled: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
    this.hasFakeInlogEnabled = HAS_FAKE_INLOG_ENABLED;
  }

  _onChangeHandler() {
    this.validated =
      /.+@.+?\..+/.test(this.username) && /.+/.test(this.password);
  }

  _showLoginWarning(jwtError) {
    return (jwtError && jwtError.message) || (true && this.validated);
  }

  _getClass(value) {
    return value ? 'classTrue' : 'classFalse';
  }

  _signInHandler() {
    if (this.validated) {
      store.dispatch(requestJwtSignin(this.username, this.password));
    }
  }

  _signInWithItsMe() {
    store.dispatch(requestOAuthInit('itsme'));
  }

  _signInWithDigiD() {
    store.dispatch(requestJwtSignin());
  }

  _signInWithDigiDFake() {
    store.dispatch(requestJwtSigninFake());
  }

  stateChanged(state) {
    this.jwtError = state.jwt.error;
  }
}

window.customElements.define('maf-screen-signin', MafScreenSignin);
