import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../redux/store';
import { orderNext, orderPrev } from '../../../redux/actions/order';
import { selectPage } from '../../../redux/actions/application';
import { requestJwtLogout } from '../../../redux/actions/jwt';
import { JOURNEY_START, JOURNEY_END } from '../../../helpers/common';

import css from './style.pcss';
import template from './template.html';

import '../maki/maki-button';

export default class PlaybackScreenWrapper extends connect(store)(
  PolymerElement
) {
  static get properties() {
    return {
      noNext: {
        type: Boolean,
        value: false,
      },
      nextCallback: {
        value: null,
      },
      skipCallback: {
        value: null,
      },
      disabled: {
        type: Boolean,
        value: false,
      },
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
  }

  _showNext(noNext, disabled, skipCallback) {
    if (typeof skipCallback === 'function' && (disabled || noNext)) {
      return false;
    }
    return !noNext;
  }

  _title(question) {
    return question && question.title ? question.title : 'Naamloze vraag';
  }

  _subtitle(question) {
    return question && question.subtitle ? question.subtitle : '';
  }

  _stop() {
    if (this.journey.isDeepLink && this.journey.stopUrl) {
      store.dispatch(requestJwtLogout(this.journey.stopUrl));
    } else {
      store.dispatch(selectPage('journeys'));
    }
  }

  _next(nextCallback, disabled) {
    return () => {
      if (typeof nextCallback === 'function' && !disabled) {
        nextCallback((next) => store.dispatch(orderNext(next)));
      }
    };
  }
  _showSkip(noNext, disabled, skipCallback) {
    return typeof skipCallback === 'function' && (disabled || noNext);
  }
  _skip(skipCallback) {
    return () => {
      if (typeof skipCallback === 'function') {
        skipCallback((skip) => store.dispatch(orderNext(skip)));
      }
    };
  }

  _prev() {
    store.dispatch(orderPrev());
  }

  isNotLastItem(current, index) {
    return this.journey.questions.length - 1 !== index;
  }
  isCurrentQuestion(current, index) {
    return current === index;
  }
  isNotAnswered(current, index) {
    return index > current;
  }
  isAnswered(current, index) {
    return index < current;
  }

  stateChanged(state) {
    this.journey = state.journey;
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
    this.current = state.order.current;
    if (this.journey.title === "Ik ga verhuizen") {
      this.show_journey_icon_truck = true;
      this.show_journey_icon_bulb = false;
    } else {
      this.show_journey_icon_truck = false;
      this.show_journey_icon_bulb = true;
    }
  }
}

window.customElements.define('playback-screen-wrapper', PlaybackScreenWrapper);
