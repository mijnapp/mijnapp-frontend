import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { store } from '../../../redux/store';
import { requestJwtSigninFake } from '../../../redux/actions/jwt';
import { requestJwtSignin } from '../../../redux/actions/jwt';
import { requestOAuthInit } from '../../../redux/actions/oauth';
import { connect } from 'pwa-helpers/connect-mixin';
import { configuration } from '../../../helpers/configuration';

import css from './style.pcss';
import template from './template.html';
import '@polymer/paper-input/paper-input';

export default class MafScreenSignin extends connect(store)(PolymerElement) {
  static get properties() {
    return {
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
    this.hasFakeInlogEnabled = configuration.HAS_FAKE_INLOG_ENABLED();
  }

  _showLoginWarning(jwtError) {
    return (jwtError && jwtError.message);
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
