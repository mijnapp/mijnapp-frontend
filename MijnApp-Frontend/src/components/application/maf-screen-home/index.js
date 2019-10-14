import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { store } from '../../../redux/store';
import { connect } from 'pwa-helpers/connect-mixin';
import { selectPage } from '../../../redux/actions/application';
import { requestContracts } from '../../../redux/actions/contracts';
import { requestAvgLogs } from '../../../redux/actions/avgLogs';
import { requestPersonData } from '../../../redux/actions/person';

import css from './style.pcss';
import template from './template.html';

import '../../objects/maf-screen';
import '../../lib/maki/maki-input';

export default class MafScreenHome extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      tiles: {
        type: Array,
        value: [
          {
            title: 'Basisgegevens',
            asset: 'assets/media/Basisgegevens.svg',
            target: 'person-data',
          },
          {
            title: 'Machtigingen',
            asset: 'assets/media/Machtigingen.svg',
            target: 'avg-logs',
          },
          {
            title: 'Contracten',
            asset: 'assets/media/Contracten.svg',
            target: 'contracts',
          },
          // {
          //   title: 'Passen',
          //   asset: '/assets/media/Passen.svg',
          //   target: '',
          // },
        ],
      },
      userID: String,
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
  }

  _clickHandler(e) {
    if (e.model == undefined) {
      const doPop = alert(
        'Deze functie komt binnenkort beschikbaar! Op dit moment wordt er hard gewerkt aan nieuwe functionaliteiten van MijnApp.'
      );
    }
    if (e.model.tile && e.model.tile.target) {
      switch (e.model.tile.target) {
        case 'contracts':
          store.dispatch(requestContracts());
          break;
        case 'person-data':
          store.dispatch(requestPersonData());
          break;
        case 'avg-logs':
          store.dispatch(requestAvgLogs());
          break;
        default:
          break;
      }
      store.dispatch(selectPage(e.model.tile.target));
    }
  }

  _goJourneys() {
    store.dispatch(selectPage('journeys'));
    // TODO: trigger search focus
  }

  stateChanged(state) {
    if (state != undefined && state.jwt.data.user != undefined) {
      this.userID = state.jwt.data.user.id;
    }
  }
}

window.customElements.define('maf-screen-home', MafScreenHome);
