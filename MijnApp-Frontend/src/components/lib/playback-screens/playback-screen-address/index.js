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
      addresses: Array,
      hasSearched: Boolean,
      hasValidPostalCodeAndNumber: Boolean,
      searching: Boolean,
      inWrongCity: Boolean,
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
      || this.postalCode === ''
      || isNullOrUndefined(this.number)
      || this.number === '';
  }

  _inputPostalCodeCallback() {
    return (data) => {
      this.postalCode = data.replace(/\s/g, '').toUpperCase().trim();
      this.callApi();
    };
  }

  _inputNumberCallback() {
    return (data) => {
      this.number = data.trim();
      this.callApi();
    };
  }

  _inputNumberAdditionCallback() {
    return (data) => {
      this.numberAddition = data.trim();
      this.callApi();
    };
  }

  callApi() {
    this.inWrongCity = false;
    // Check on valid postalCode and number.
    if (this.postalCode !== undefined &&
      this.postalCode !== null &&
      this.postalCode.length > 5 &&
      this.number !== undefined &&
      this.number !== null &&
      this.number.length > 0) {
      this.set('hasValidPostalCodeAndNumber', true);
    } else {
      this.set('hasValidPostalCodeAndNumber', false);
    }
    if (!this._isEmpty() && this.hasValidPostalCodeAndNumber) {
      store.dispatch(requestAddressData(this.postalCode, this.number, this.numberAddition));
    } else {
      this.addresses = [];
    }
  }

  showApiResult(hasSearched, hasValidPostalCodeAndNumber) {
    return hasSearched && hasValidPostalCodeAndNumber;
  }

  _saveWithoutCheck(question, address) {
    store.dispatch(
      orderSaveAnswer(
        question.key || question.property,
        address.id,
        question.fieldName,
        `${address.straat} ${address.huisnummer}${address.huisnummertoevoeging ? ' ' + address.huisnummertoevoeging : ''}, ${address.postcode} ${address.woonplaats}`
      )
    );
    store.dispatch(orderNext(question.next));
  }

  _optionClick(e) {
    const self = this;
    if (e && e.currentTarget && e.currentTarget.dataQuestion && !isNaN(e.currentTarget.dataIndex)) {
      const question = e.currentTarget.dataQuestion;
      const index = e.currentTarget.dataIndex;
      const address = this.addresses[index];
      if (address.woonplaats !== '\'s-Hertogenbosch'
        && address.woonplaats !== 'Rosmalen'
        && address.woonplaats !== 'Nuland'
        && address.woonplaats !== 'Vinkel') {
        this.inWrongCity = true;
      } else {
        self._saveWithoutCheck(question, address);
      }
    }
  }

  _skipCallback(question) {
    if (question && question.optional && question.optional.goto) {
      return (skip) => skip(question.optional.goto);
    }
    return null;
  }

  _reset() {
    this.postalCode = '';
    this.number = '';
    this.numberAddition = '';
    this.addresses = [];
    this.hasSearched = false;
    this.inWrongCity = false;
  }

  ready() {
    super.ready();
    const postalCodeInput = this.shadowRoot.getElementById('postalCodeInput');
    const numberInput = this.shadowRoot.getElementById('numberInput');
    const numberAdditionInput = this.shadowRoot.getElementById('numberAdditionInput');
    postalCodeInput.addEventListener('keyup', function (e) {
      if (e.keyCode === 13) {
        numberInput.shadowRoot.querySelector('.Input').focus();
      }
    });
    numberInput.addEventListener('keyup', function (e) {
      if (e.keyCode === 13) {
        numberAdditionInput.shadowRoot.querySelector('.Input').focus();
      }
    });
  }

  filterAddresses(address) {
    var statusVerblijfsobjectNoSpaces = address.statusVerblijfsobject.replace(/\s/g, '').toLowerCase();
    if (statusVerblijfsobjectNoSpaces === 'verblijfsobjectingetrokken'
      || statusVerblijfsobjectNoSpaces === 'nietgerealiseerdverblijfsobject'
      || statusVerblijfsobjectNoSpaces === 'plaatsingetrokken') {
      return false;
    }

    return true;
  }

  hasAddition(addition) {
    return addition !== undefined;
  }

  stateChanged(state) {
    this.journey = state.journey;
    this.current = state.order.current;
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

    if (this._isEmpty()) {
      this.addresses = [];
    } else {
      this.addresses = state.address.data.filter(this.filterAddresses);
      this.hasSearched = true;
      this.searching = state.address.searching;
      const self = this;
      setTimeout(function() {
        self.shadowRoot.querySelector('#foundAddresses').scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }, 400);
    }
    if (state.address.reset) {
      this._reset();
    }
  }
}

window.customElements.define('playback-screen-address', PlaybackScreenAddress);
