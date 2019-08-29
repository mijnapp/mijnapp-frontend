import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';

import { JOURNEY_START } from '../../../../helpers/common';

import { orderNext, orderSaveAnswer } from '../../../../redux/actions/order';

import css from './style.pcss';
import template from './template.html';

import '../../playback-screen-wrapper';
import { requestAddressData } from '../../../../redux/actions/address';
import { isNullOrUndefined } from 'util';

export default class PlaybackScreenAddress extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      postalCode: String,
      number: String,
      numberAddition: String,
      addresses: Array
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
  }

  _isEmpty() {
    return isNullOrUndefined(this.postalCode)
      || this.postalCode === ""
      || isNullOrUndefined(this.number)
      || this.number === "";
  }

  _inputPostalCodeCallback() {
    return (data) => {
      this.postalCode = data.trim();
      this.notifyPath("_isEmpty")
      if (!this._isEmpty()) {
        store.dispatch(requestAddressData(this.postalCode, this.number, this.numberAddition));
      } else {
        this.addresses = [];
      }
    };
  }

  _inputNumberCallback() {
    return (data) => {
      this.number = data.trim();
      if (!this._isEmpty()) {
        store.dispatch(requestAddressData(this.postalCode, this.number, this.numberAddition));
      } else {
        this.addresses = [];
      }
    };
  }

  _inputNumberAdditionCallback() {
    return (data) => {
      this.numberAddition = data.trim();
      if (!this._isEmpty()) {
        store.dispatch(requestAddressData(this.postalCode, this.number, this.numberAddition));
      } else {
        this.addresses = [];
      }
    };
  }

  _optionClick(e) {
    if (e && e.target && e.target.dataQuestion && !isNaN(e.target.dataIndex)) {
      let question = e.target.dataQuestion;
      let index = e.target.dataIndex;
      let value = this.addresses[index].id;
      store.dispatch(
        orderSaveAnswer(
          question.key || question.title,
          value,
          question.title,
          value
        )
      );
      store.dispatch(orderNext(question.next));
      store.dispatch(this._nextCallback(question));
    }
  }

  _skipCallback(question) {
    if (question && question.optional && question.optional.goto) {
      return (skip) => skip(question.optional.goto);
    }
    return null;
  }

  stateChanged(state) {
    this.journey = state.journey;
    this.current = state.order.current;
    this.addresses = state.address.data;
    this.id = this.current === JOURNEY_START
        ? JOURNEY_START
        : state.order.data[this.current].question;
    this.order = this.current === JOURNEY_START ? {} : state.order.data[this.current];
    this.selected = this.order._tracker;
    if (this.journey) {
      this.question = (this.journey.questions || []).find(
        (q) => q.id === this.id
      );
    }
    if (!this.question) {
      this.question = '';
    }
  }
}

window.customElements.define('playback-screen-address', PlaybackScreenAddress);
