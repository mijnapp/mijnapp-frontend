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

export default class PlaybackScreenRadioButtons extends connect(store)(
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

  _optionNames(question) {
    return question && question.options && Array.isArray(question.options)
      ? question.options.map((o) => (o.title ? o.title : 'Naamloze optie'))
      : [];
  }

  _isSelected(index, selected) {
    return !isNaN(selected) && !isNaN(index) && selected === index
      ? ' selected'
      : '';
  }

  _optionClick(e) {
    if (e && e.target && !isNaN(e.target.dataIndex)) {
      const index = e.target.dataIndex;
      if (index === this.selected) {
        store.dispatch(orderClearAnswer());
      } else {
        const key = this.question.key || this.question.property;
        const keyTitle = this.question.fieldName;
        const value = this.question.options[index].value || this.question.options[index].title;
        const valueTitle = this.question.options[index].fieldName;
        store.dispatch(
          orderSaveAnswer(key, value, keyTitle, valueTitle, null, index)
        );
      }
    }
  }

  _nextCallback(question, selected) {
    return (next) => {
      if (
        question &&
        !isNaN(selected) &&
        question.options &&
        Array.isArray(question.options) &&
        question.options.length > selected &&
        question.options[selected] &&
        question.options[selected].goto
      ) {
        next(question.options[selected].goto);
      }
    };
  }

  _skipCallback(question) {
    if (question && question.optional && question.optional.goto) {
      return (skip) => skip(question.optional.goto);
    }
    return null;
  }

  _isDisabled(_, question, selected) {
    return !(
      question &&
      !isNaN(selected) &&
      question.options &&
      Array.isArray(question.options) &&
      question.options.length > selected &&
      question.options[selected] &&
      question.options[selected].goto
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
  'playback-screen-radio-buttons',
  PlaybackScreenRadioButtons
);
