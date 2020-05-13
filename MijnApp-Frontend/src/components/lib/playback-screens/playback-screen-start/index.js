import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';
import { orderNext } from '../../../../redux/actions/order';
import { selectPage } from '../../../../redux/actions/application';
import { JOURNEY_START, JOURNEY_END } from '../../../../helpers/common';

import css from './style.pcss';
import template from './template.html';

export default class PlaybackScreenStart extends connect(store)(
  PolymerElement
) {
  static get properties() {
    return {
      preconditionsFullFilled: Boolean,
      preconditionsBeingChecked: Boolean,
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
  }

  _stop() {
    //store.dispatch(selectPage('journeys'));
    window.location = 'https://www.s-hertogenbosch.nl/verhuizen';
  }

  _title(journey) {
    return journey && journey.title ? journey.title : 'Naamloos';
  }

  _subtitle(journey) {
    return journey && journey.overview && journey.overview.subtitle
      ? journey.overview.subtitle
      : 'Geen subtitel';
  }

  _indexToCount(index) {
    return !isNaN(index) ? index + 1 : 1;
  }

  _documents(journey) {
    return journey &&
      journey.overview &&
      journey.overview.needed_documents &&
      Array.isArray(journey.overview.needed_documents)
      ? journey.overview.needed_documents
      : [];
  }

  _hasDocuments(journey) {
    return this._documents(journey).length > 0;
  }
    
  _steps(journey) {
    return journey &&
      journey.overview &&
      journey.overview.steps &&
      Array.isArray(journey.overview.steps)
      ? journey.overview.steps
      : [];
  }

  _start(journey) {
    return () => {
      if (!this.preconditionsFullFilled) return;
      if (
        journey &&
        journey.questions &&
        Array.isArray(journey.questions) &&
        journey.questions.length > 0 &&
        journey.questions[0].id
      ) {
        store.dispatch(orderNext(journey.questions[0].id));
      } else {
        store.dispatch(orderNext(JOURNEY_END));
      }
    };
  }

  stateChanged(state) {
    this.journey = state.journey;
    this.preconditionsFullFilled = state.journey.preconditionsFullFilled;
    this.preconditionsBeingChecked = state.journey.preconditionsBeingChecked;
    this.id =
      state.order.current === JOURNEY_START
        ? JOURNEY_START
        : state.order.data[state.order.current].question;
    if (this.id === JOURNEY_START) {
      this.question = { type: 'start' };
    } else if (this.id === JOURNEY_END) {
      this.question = { type: 'end' };
    } else if (this.journey) {
      this.question = (this.journey.questions || []).find(
        (q) => q.id === this.id
      );
    }
    if (!this.question) {
      this.question = '';
    }
    if (this.journey.title === 'Ik ga verhuizen') {
      this.show_journey_icon_truck = true;
      this.show_journey_icon_bulb = false;
    } else {
      this.show_journey_icon_truck = false;
      this.show_journey_icon_bulb = true;
    }
  }
}

window.customElements.define('playback-screen-start', PlaybackScreenStart);
