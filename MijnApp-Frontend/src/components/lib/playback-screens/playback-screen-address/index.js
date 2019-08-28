import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';

import { JOURNEY_START } from '../../../../helpers/common';

import {
  orderSaveAnswer,
  orderClearAnswer,
} from '../../../../redux/actions/order';

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
    this.postalCode = "";
    this.number = "";
    this.numberAddition = "";
    this.addresses = [{ id: 'test1' }, { id: 'test2' }];
  }

  isEmpty() {
    return isNullOrUndefined(this.postalCode)
      || this.postalCode === ""
      || isNullOrUndefined(this.number)
      || this.number === "";
  }

  _inputPostalCodeCallback() {
    return (data) => {
      this.postalCode = data.trim();
      if (!this.isEmpty()) {
        store.dispatch(requestAddressData(this.postalCode, this.number, this.numberAddition));
      }
    };
  }

  _inputNumberCallback() {
    return (data) => {
      this.number = data.trim();
      if (!this.isEmpty()) {
        store.dispatch(requestAddressData(this.postalCode, this.number, this.numberAddition));
      }
    };
  }

  _inputNumberAdditionCallback() {
    return (data) => {
      this.numberAddition = data.trim();
      if (!this.isEmpty()) {
        store.dispatch(requestAddressData(this.postalCode, this.number, this.numberAddition));
      }
    };
  }

  _selectAddress() {
    let key =
      question && question.options && Array.isArray(question.options)
        ? question.options.map((i) => i.value || i.title || 'Naamloos veld')
        : [];
    let keyTitle =
      question && question.options && Array.isArray(question.options)
        ? question.options.map(
          (i) =>
            `${question.title || 'Naamloze vraag'}: ${i.title ||
            'Naamloos veld'}`
        )
        : [];

    return (data) => {
      let value = order.value && Array.isArray(order.value)
        ? order.value.map((o, i) => (i === index ? data : o))
        : key.map((o, i) => (i === index ? data : ''));
      store.dispatch(orderSaveAnswer(key, value, keyTitle, value));
  };
}

  _nextCallback(question) {
    return (next) => {
      console.log(question, next);
      if (question && question.next) {
        next(question.next);
      }
    };
  }

  _skipCallback(question) {
    if (question && question.optional && question.optional.goto) {
      return (skip) => skip(question.optional.goto);
    }
    return null;
  }

  _isDisabled(order) {
    return !(
      order &&
      order.value &&
      Array.isArray(order.value) &&
      order.value.map((i) => i.length).reduce((a, b) => a + b, 0) > 0
    );
  }

  _getAddresses() {
    return this.addresses;
  }
  _getAddressId(index) {
    return []; //isNullOrUndefined(this.addresses) || this.addresses.length === [] ? '' : this.addresses[index].id;
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
