import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { store } from '../../../redux/store';
import { connect } from 'pwa-helpers/connect-mixin';
import { selectPage } from '../../../redux/actions/application';

import css from './style.pcss';
import template from './template.html';
import '../../objects/maf-screen';

export default class MafScreenOrders extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      searching: Boolean,
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
  }

  _onBack() {
    store.dispatch(selectPage('home'));
  }

  _clickHandler(e) {
  }

  stateChanged(state) {
    if (state.orders.data != undefined) {
      this.orders = state.orders.data;
      this.searching = state.orders.searching;
    }
  }
}

window.customElements.define('maf-screen-orders', MafScreenOrders);
