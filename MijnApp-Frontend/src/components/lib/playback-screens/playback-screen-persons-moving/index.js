import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';
import { orderSaveAnswer, orderSkip, orderNext, } from '../../../../redux/actions/order';
import {
  requestPersonsMoving,
  clearPersonsMoving,
  CLEAR_PERSONS_MOVING,
  REQUEST_PERSONS_MOVING_SKIPQUESTION,
  requestPersonsMovingSkipQuestion,
} from '../../../../redux/actions/person';
import { JOURNEY_START, QUESTION_TYPE_PERSONS_MOVING, } from '../../../../helpers/common';
import css from './style.pcss';
import template from './template.html';

import '../../playback-screen-wrapper';

export default class PlaybackScreenPersonsMoving extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      persons: Array,
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
    this.persons = [
      {
        id: 1,
        name: 'Eveliene de Vries',
        selected: false,
      }
    ];
  }

  _isSelected(selected) {
    return selected
      ? 'Circle selected'
      : 'Circle';
  }

  _optionClick(e) {
    if (e && e.target && !isNaN(e.target.dataIndex)) {
      const index = e.target.dataIndex;

      this.set(`persons.${index}.selected`, !this.persons[index].selected);

      const selectedPersons = this.persons.filter(function (item) { return item.selected });
      const ids = selectedPersons.map(function (item) { return item.id; });
      const names = selectedPersons.map(function (item) { return item.naam.volledigenaam; });

      store.dispatch(
        orderSaveAnswer(
          this.question.key || this.question.property,
          ids,
          this.question.title,
          names,
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

  _getPersons() {
    store.dispatch(requestPersonsMoving());
  }

  _clearPersonData() {
    store.dispatch(clearPersonsMoving());
  }

  stateChanged(state) {
    this.journey = state.journey;
    this.current = state.order.current;
    if (this.current === JOURNEY_START) {
      this.id = JOURNEY_START;
      this.order = {};
    } else {
      this.id = state.order.data[this.current].question;
      this.order = state.order.data[this.current];
    }
    this.selected = this.order._tracker;
    if (this.journey) {
      this.question = (this.journey.questions || []).find(
        (q) => q.id === this.id
      );
    }
    if (!this.question) {
      this.question = '';
    }

    this.persons = state.person.movingPersons;
    this.personsStatus = state.person.movingPersonsStatus;
    if (this.question.type === QUESTION_TYPE_PERSONS_MOVING && this.personsStatus === CLEAR_PERSONS_MOVING) {
      this._getPersons();
    }
    if (this.current === JOURNEY_START && state.order.data.length === 0 && this.personsStatus !== CLEAR_PERSONS_MOVING) {
      this._clearPersonData();
    }
    if (this.question.type === QUESTION_TYPE_PERSONS_MOVING && this.personsStatus === REQUEST_PERSONS_MOVING_SKIPQUESTION) {
      const self = this;
      store.dispatch({
        action1: store.dispatch(requestPersonsMovingSkipQuestion()),
        action2: store.dispatch(orderSkip(self.current)),
        action3: store.dispatch(orderNext(self.question.next)),
      });

    }
  }
}

window.customElements.define(
  'playback-screen-persons-moving',
  PlaybackScreenPersonsMoving
);
