import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';
import { orderSaveAnswer, orderClearAnswer, } from '../../../../redux/actions/order';
import { JOURNEY_START } from '../../../../helpers/common';
import css from './style.pcss';
import template from './template.html';

import '../../playback-screen-wrapper';

export default class PlaybackScreenMultiple extends connect(store)(PolymerElement) {
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
    return Array.isArray(selected) &&
      !isNaN(index) &&
      selected.indexOf(index) > -1
      ? ' selected'
      : '';
  }

  _answerFromSelects(selects = []) {
    const question = this.question;
    const getGoto = (index) =>
      question &&
      question.options &&
      Array.isArray(question.options) &&
      question.options[index]
        ? question.options[index]
        : {};
    return {
      value: selects.map((i) => {
        const opt = getGoto(i);
        return opt.value || opt.title;
      }),
      valueTitle: selects.map((i) => getGoto(i).title),
    };
  }

  _optionClick(e) {
    if (e && e.target && !isNaN(e.target.dataIndex)) {
      const index = e.target.dataIndex;
      const key = this.question.key || this.question.property;
      const keyTitle = this.question.fieldName;
      let selected = [];
      if (Array.isArray(this.selected) && this.selected.indexOf(index) > -1) {
        selected = this.selected.filter((i) => i !== index);
      } else {
        selected = [...(this.selected || []), index];
      }
      const answer = this._answerFromSelects(selected);
      store.dispatch(
        orderSaveAnswer(
          key,
          answer.value,
          keyTitle,
          answer.valueTitle,
          null,
          selected
        )
      );
    }
  }

  _nextCallback(question) {
    return (next) => {
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

  _isDisabled() {
    return false;
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
  'playback-screen-multiple',
  PlaybackScreenMultiple
);
