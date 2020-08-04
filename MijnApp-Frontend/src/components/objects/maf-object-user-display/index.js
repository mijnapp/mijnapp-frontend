import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../redux/store';

import css from './style.pcss';
import template from './template.html';

import '../../lib/maki/maki-header';
import '../../lib/maki/maki-button';
import '../../lib/maki-icons/maki-icon-search';
import '../../lib/maki-icons/maki-icon-cross';

export default class MafObjectUserDisplay extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      userName: {
        type: String,
      },
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
    this.showUserName = false;
  }

  stateChanged(state) {
    if (state != undefined && state.person != undefined && state.person.data != undefined && state.person.data.naam != undefined) {
      this.userName = state.person.data.naam.aanschrijfwijze;
      this.showUserName = true;
    }
  }
}

window.customElements.define('maf-object-user-display', MafObjectUserDisplay);
