import { PolymerElement, html } from '@polymer/polymer/polymer-element';

import css from './style.pcss';
import template from './template.html';

import '../maki-shaded-paper';

export default class MakiInput extends PolymerElement {
  static get properties() {
    return {
      iconLeft: {
        type: Boolean,
        value: false,
      },
      iconRight: {
        type: Boolean,
        value: false,
      },
      placeholder: {
        type: String,
      },
      maxlength: {
        type: String,
      },
      focussed: {
        type: Boolean,
        value: false,
      },
      type: {
        type: String,
        value: '',
      },
      pattern: {
        type: String,
        value: null,
      },
      value: {
        type: Object,
        value: '',
      },
      inputCallback: {
        type: Function,
        value: () => {},
      },
      showInputPatternValidationMessage: {
        type: Boolean,
        value: false,
      },
      patternValidationErrorMessage: {
        type: String,
        value: 'Invalide invoer',
      },

      // Props: Shaded Paper
      accentDisabled: {
        type: Boolean,
      },
      accentError: {
        type: Boolean,
      },
      accentPrimary: {
        type: Boolean,
      },
      accentSecondary: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
      },
      error: {
        type: Boolean,
      },
      fill: {
        type: Boolean,
      },
      primary: {
        type: Boolean,
      },
      secondary: {
        type: Boolean,
      },
      transparent: {
        type: Boolean,
      },

      // Props: Paper
      elevation: {
        type: Number,
      },
      rounding: {
        type: Number,
      },
      stroke: {
        type: Number,
      },
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();
    const field = this.shadowRoot.querySelector('.Input');
    if (field.type === 'number') {
      field.addEventListener('keypress', this._removeSigns.bind(this));
      field.setAttribute('pattern', '\\d*');
    }
    field.addEventListener('focus', this._onFocus.bind(this));
    field.addEventListener('blur', this._onBlur.bind(this));
  }

  _removeSigns(e) {
    if (e.key === '-' || e.key === '+' || e.key === '.' || e.key === ',') {
      e.preventDefault();
    }
  }

  _onBlur() {
    this.focussed = false;
    this._checkPatternValidity();
  }

  _onFocus() {
    this.focussed = true;
  }

  _onInput(e) {
    this.inputCallback(e.target.value);
  }

  _isFocussed(focussed) {
    return focussed ? ' focussed' : '';
  }

  _hasIconLeft(iconLeft) {
    return iconLeft ? ' iconLeft' : '';
  }

  _hasIconRight(iconRight) {
    return iconRight ? ' iconRight' : '';
  }

  _checkPatternValidity() {
    const field = this.shadowRoot.querySelector('.Input');
    this.showInputPatternValidationMessage = false;
    if (field.hasAttribute('pattern')) {
      var valid = field.checkValidity();
      if (!valid) {
        this.showInputPatternValidationMessage = true;
      }
    }
  }
}

window.customElements.define('maki-input', MakiInput);
