import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';

import {
  orderSaveAnswer,
  orderClearAnswer,
} from '../../../../redux/actions/order';

import { JOURNEY_START } from '../../../../helpers/common';

import css from './style.pcss';
import template from './template.html';

import '../../playback-screen-wrapper';
import '../../maki/maki-input';

export default class PlaybackScreenMultipleText extends connect(store)(
  PolymerElement
) {
  static get properties() {
    return {};
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
  }

  _items(question) {
    return question && question.options && Array.isArray(question.options)
      ? question.options
      : [];
  }

  _itemTitle(title) {
    return title ? title : 'Naamloos veld';
  }

  _inputCallback(question, index, order) {
    const key = question && question.options && Array.isArray(question.options)
      ? question.options.map((i) => i.value || i.fieldName || 'Naamloos veld')
      : [];
    const keyTitle = question && question.options && Array.isArray(question.options) ? question.fieldName : "";
    return (data) => {
      store.dispatch(
        orderSaveAnswer(key,
          order.value && Array.isArray(order.value)
            ? order.value.map((o, i) => (i === index ? data : o))
            : key.map((o, i) => (i === index ? data : '')),
          keyTitle,
          order.value && Array.isArray(order.value)
            ? order.value.map((o, i) => (i === index ? data : o))
            : key.map((o, i) => (i === index ? data : ''))
        )
      );
    };
  }

  _determineType(pattern) {
    if (pattern === '([-.0-9 ])*\\d') {
      return 'number';
    }
    return '';
  }

  _getValue(order, index) {
    return order &&
      order.value &&
      Array.isArray(order.value) &&
      order.value.length > index
      ? order.value[index]
      : '';
  }

  _nextCallback(question) {
    return (next) => {
      if (question && question.next && this._checkInputPatternValidation()) {
        next(question.next);
      }
    };
  }

  _checkInputPatternValidation() {
    var inputsValid = true;
    var inputs = this.shadowRoot.querySelectorAll('maki-input');
    inputs.forEach(function (makiInput) {
      var input = makiInput.shadowRoot.querySelector('input');
      inputsValid = inputsValid && input.checkValidity();
    });
    return inputsValid;
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
      order.value.map((i) => i.length).reduce((a, b) => a + b, 0) > 0 &&
      this._checkInputPatternValidation()
    );
  }

  stateChanged(state) {
    this.journey = state.journey;
    this.current = state.order.current;
    this.id =
      this.current === JOURNEY_START
        ? JOURNEY_START
        : state.order.data[this.current].question;
    this.order =
      this.current === JOURNEY_START ? {} : state.order.data[this.current];
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

window.customElements.define(
  'playback-screen-multiple-text',
  PlaybackScreenMultipleText
);
