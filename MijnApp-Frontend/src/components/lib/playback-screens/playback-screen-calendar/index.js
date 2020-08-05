import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';
import { orderSaveAnswer } from '../../../../redux/actions/order';
import { JOURNEY_START } from '../../../../helpers/common';
import css from './style.pcss';
import template from './template.html';
var moment = require('moment');

import '../../playback-screen-wrapper';
import '../../polymer-openajax-datepicker-master/polymer-openajax-datepicker';

export default class PlaybackScreenCalendar extends connect(store)(
  PolymerElement
) {
  static get properties() {
    return {
      datepickerValue: {
        type: String,
        notify: true,
        observer: '_datePickerValueChanged',
      },
      daysInPastWarning: {
        type: Number,
      },
      daysInFutureDisabled: {
        type: Number,
        observer: '_daysInFutureDisabledChanged',
      },
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
    this.datepickerValueText = '';
    moment.locale('nl');
    this.currentDateText = moment().format('D MMMM YYYY');
    this.showDaysInPastWarningMessage = false;
  }

  _daysInFutureDisabledChanged() {
    this.datepickerMaxDate = moment().add(this.daysInFutureDisabled, 'days').format('YYYY-MM-DD'); // ISO 8601 format
  }

  _title(question) {
    return question && question.title ? question.title : 'Naamloze vraag';
  }

  _datePickerValueChanged(data) {
    const question = this.question;
    var warningMessage = '';

    if (data) {
      var selectedDate = moment(data, 'DD-MM-YYYY');
      this.datepickerValueText = selectedDate.format('D MMMM YYYY');
      var selectedDateWithDaysAdded = selectedDate.add(this.daysInPastWarning + 1, 'days');
      // If the selected date + offset is before the current date, show the warning.
      this.showDaysInPastWarningMessage = selectedDateWithDaysAdded.isBefore(moment());
      if (this.showDaysInPastWarningMessage) {
        warningMessage =
          'Uw verhuizing was langer dan ' +
          this.daysInPastWarning +
          ' dagen geleden. De gemeente zal uw verhuisdatum aanpassen naar de datum van vandaag (' +
          this.currentDateText +
          ').';
      }
    }
    store.dispatch(
      orderSaveAnswer(
        question.key || question.property,
        data,
        question.fieldName,
        this.datepickerValueText,
        null,
        null,
        warningMessage
      )
    );
  }

  _getValue(order) {
    return order && order.value ? order.value : '';
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

  _isDisabled(order) {
    return !this._getValue(order);
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
    if (this.current === JOURNEY_START && state.order.data.length === 0) {
      // Reset the datepicker value if we start a new journey,
      // and no answers have been filled in.
      this.datepickerValue = '';
    }
  }
}

window.customElements.define('playback-screen-calendar', PlaybackScreenCalendar);
