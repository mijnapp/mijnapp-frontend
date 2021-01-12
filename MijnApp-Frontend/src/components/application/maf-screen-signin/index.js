import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { store } from '../../../redux/store';
import { requestJwtSigninFake } from '../../../redux/actions/jwt';
import { requestJwtSignin } from '../../../redux/actions/jwt';
import { connect } from 'pwa-helpers/connect-mixin';
import { configuration } from '../../../helpers/configuration';

import css from './style.pcss';
import template from './template.html';
import '@polymer/paper-input/paper-input';

export default class MafScreenSignin extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      hasFakeInlogEnabled: {
        type: Boolean,
        value: false,
      },
      loginTitle: {
        type: String,
        value: 'Verhuizing doorgeven',
      },
      loginSubTitleText1: {
        type: String,
        value: 'U gaat een verhuizing doorgeven in of naar de gemeente \'s-Hertogenbosch.',
      },
      loginSubTitleText2: {
        type: String,
        value: 'U moet in dit formulier inloggen met DigiD.',
      },
      showFakeUsersSelect: {
        type: Boolean,
        value: false,
      },
      fakeUsers: {
        value() {
          return [
            { bsn: '999999102', name: 'Jeroen Oranje' },
            { bsn: '999999114', name: 'Yvonne Rood' },
            { bsn: '999999126', name: 'Stan Oranje' },
            { bsn: '999999138', name: 'Tim Oranje' },
            { bsn: '999999151', name: 'Luuk Oranje' },
            { bsn: '999999163', name: 'Wim Fris' },
            { bsn: '999999011', name: 'Angeline Warm' },
            { bsn: '999999175', name: 'Renate Fris' },
            { bsn: '999999060', name: 'Leon Giraf' },
            { bsn: '999999187', name: 'Tobias Reus' },
            { bsn: '999999199', name: 'Ton Reus' },
            { bsn: '999999205', name: 'Inge Links' },
            { bsn: '999999217', name: 'Erik Rechts' },
            { bsn: '999993653', name: 'Suzanne van der Stappen' },
            { bsn: '999990639', name: 'Mattheus du Burck' },
            { bsn: '999993872', name: 'Peter - Jan van der Meijden' },
            { bsn: '999992740', name: 'Jael de Jager' },
            { bsn: '999991723', name: 'Lukas Klamer' },
            { bsn: '999990317', name: 'Nasier Boeddhoe' },
            { bsn: '999993793', name: 'Rodney Plieger' },
            { bsn: '999990561', name: 'Thomas Thuisloos' },
            { bsn: '999998870', name: 'Marjolein Thuisloos' },
          ];
        },
      },
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
    this.hasFakeInlogEnabled = configuration.HAS_FAKE_INLOG_ENABLED();
  }

  _showLoginWarning(jwtError) {
    return (jwtError && jwtError.message);
  }
  
  _signInWithDigiD() {
    store.dispatch(requestJwtSignin());
  }

  _showFakeUserSelect() {
    this.showFakeUsersSelect = true;
  }

  _userChanged(event) {
    var fakeBsn = event.target.value;
    store.dispatch(requestJwtSigninFake(fakeBsn));
  }

  stateChanged(state) {
    this.jwtError = state.jwt.error;
  }
}

window.customElements.define('maf-screen-signin', MafScreenSignin);
