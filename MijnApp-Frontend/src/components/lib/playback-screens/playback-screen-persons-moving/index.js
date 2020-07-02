import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';
import { orderSaveAnswer, orderSkip, orderNext, } from '../../../../redux/actions/order';
import {
  requestPersonsMoving,
  clearPersonsMoving,
  CLEAR_PERSONS_MOVING,
  REQUEST_PERSONS_MOVING_SUCCESS,
  REQUEST_PERSONS_MOVING_FAILURE,
  REQUEST_PERSONS_MOVING_SKIPQUESTION,
  requestPersonsMovingSkipQuestion,
  REQUEST_PERSONS_MOVING_SELECT_ALL,
  requestPersonsMovingSelectAll,
} from '../../../../redux/actions/person';
import { JOURNEY_START, QUESTION_TYPE_PERSONS_MOVING, } from '../../../../helpers/common';
import css from './style.pcss';
import template from './template.html';
import '../../playback-screen-wrapper';

var moment = require('moment');

export default class PlaybackScreenPersonsMoving extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      persons: Array,
      searchingMovingPersons: Boolean,
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
    this.persons = [];
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

      this.saveSelectedPersons();
    }
  }

  selectAllPersons() {
    for (let i = 0; i < this.persons.length; i++) {
      this.set(`persons.${i}.selected`, true);
    }
    this.saveSelectedPersons();
  }

  saveSelectedPersons() {
    const self = this;

    const selectedPersons = self.persons.filter(function (item) { return item.selected; });
    const ids = selectedPersons.map(function (item) { return item.id; });
    const bsns = selectedPersons.map(function (item) { return item.burgerservicenummer; });
    const names = selectedPersons.map(function (item) { return self._formatPersonInformation(item); });
    store.dispatch(requestPersonsMovingSelectAll());
    store.dispatch(orderSaveAnswer(self.question.key || self.question.property, ids, self.question.fieldName, names, self.question.property2, bsns));
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

  _getPersons() {
    store.dispatch(requestPersonsMoving());
  }

  _formatPersonInformation(person) {
    if (person === null || person.naam === null) {
      return 'Onbekende persoon';
    }

    var info = person.naam.aanschrijfwijze;

    if (person.geboorte === null || person.geboorte.datum === null || person.geboorte.datum.date === null) {
      return info;
    }

    return `${info}, geboren op ${moment(person.geboorte.datum.date).format('DD-MM-YYYY')}`;
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

    if (this.question.type !== QUESTION_TYPE_PERSONS_MOVING && this.personsStatus === REQUEST_PERSONS_MOVING_FAILURE) {
      this._clearPersonData();
    }

    this.searchingMovingPersons = state.person.movingPersonsSearching;
    this.isDisabled = this.personsStatus !== REQUEST_PERSONS_MOVING_SUCCESS;
    if (this.question.type === QUESTION_TYPE_PERSONS_MOVING && this.personsStatus === CLEAR_PERSONS_MOVING) {
      this._getPersons();
    }
    if (this.current === JOURNEY_START && state.order.data.length === 0 && this.personsStatus !== CLEAR_PERSONS_MOVING) {
      this._clearPersonData();
    }
    if (this.question.type === QUESTION_TYPE_PERSONS_MOVING && this.personsStatus === REQUEST_PERSONS_MOVING_SKIPQUESTION) {
      const self = this;
      const selectedPersons = self.persons.filter(function (item) { return item.selected; });
      const ids = selectedPersons.map(function (item) { return item.id; });
      const bsns = selectedPersons.map(function (item) { return item.burgerservicenummer; });
      const names = selectedPersons.map(function (item) { return self._formatPersonInformation(item); });
      store.dispatch({
        action1: store.dispatch(requestPersonsMovingSkipQuestion()),
        action2: store.dispatch(orderSaveAnswer(self.question.key || self.question.property, ids, self.question.fieldName, names, self.question.property2, bsns)),
        action3: store.dispatch(orderSkip(self.current)),
        action4: store.dispatch(orderNext(self.question.next)),
      });
    }
    if (this.question.type === QUESTION_TYPE_PERSONS_MOVING && this.personsStatus === REQUEST_PERSONS_MOVING_SELECT_ALL) {
      this.selectAllPersons();
    }
  }
}

window.customElements.define(
  'playback-screen-persons-moving',
  PlaybackScreenPersonsMoving
);
