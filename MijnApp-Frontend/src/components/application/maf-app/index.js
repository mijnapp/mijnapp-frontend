import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { store } from '../../../redux/store';

import { selectPage, selectPageNoHistory } from '../../../redux/actions/application';
import { setJourney } from '../../../redux/actions/journey';
import { requestJwtLogout } from '../../../redux/actions/jwt';
import { clearAddressData } from '../../../redux/actions/address';
import { setJourneys } from '../../../redux/actions/journeys';

import { getJourneyId } from '../../../redux/helpers/journeys';

import { connect } from 'pwa-helpers/connect-mixin';

import css from './style.pcss';
import template from './template.html';
import '@polymer/iron-pages';
import '../maf-screen-avg-log';
import '../maf-screen-avg-logs';
import '../maf-screen-contract';
import '../maf-screen-contracts';
import '../maf-screen-home';
import '../maf-screen-journey';
import '../maf-screen-journeys';
import '../maf-screen-signin';
import '../maf-screen-person-data';
import '../maf-screen-orders';
import '../../lib/maki-icons/maki-icon-home';
import '../../lib/maki-icons/maki-icon-search';
import '../../lib/maki-icons/maki-icon-bell';
import '../../lib/maki-icons/maki-icon-chat';
import '../../lib/maki-icons/maki-icon-confetti';
import '../../lib/maki-icons/maki-icon-logout';
import '../../lib/maki-icons/maki-icon-hamburger';
import '../../lib/maki-icons/maki-icon-edit-document';
import '../../lib/maki-icons/maki-icon-steps';
import '../../lib/maki-icons/maki-icon-check';
import '../../lib/maki-icons/maki-icon-attention';

import { MakiTheme } from '../../lib/maki/maki-theme-provider';
import { primaryPalette, secondaryPalette } from '../../helpers/palettes';
import { requestJwtTokenForDigidCgi } from '../../../redux/actions/jwt';

export default class MafApp extends connect(store)(PolymerElement) {
  static get properties() {
    return {
      theme: {
        type: Object,
      },
    };
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();

    // Temporary until we have a service to retrieve the possible journeys
    this.setFakeJourneys();

    window.onpopstate = function(event) {
      store.dispatch(selectPageNoHistory(event.state));
    };

    if (window.location.pathname && window.location.pathname.length > 0) {
      if (window.location.pathname.indexOf('digidcgifinished') > -1) {
        this._handleDigidCgi();
      } else if (window.location.pathname.indexOf('startjourney') > -1) {
        this._handleStartJourney();
      } else {
        const path = window.location.pathname.charAt(0) === '/' ? window.location.pathname.substring(1) : window.location.pathname;
        store.dispatch(selectPageNoHistory(path));
      }
    }
  }

  ready() {
    super.ready();

    // Check for userLogin dirty
    setTimeout(() => {
      if (store.getState().jwt.data.user === undefined) {
        store.dispatch(selectPageNoHistory('signin'));
      }
    }, 500);
    const theme = {
      palette: {
        primary: {
          light: '#d6dce2',
          main: primaryPalette[500],
          dark: primaryPalette[500],
        },
        secondary: {
          main: secondaryPalette[500],
        },
      },
      shadows: {},
    };

    for (let i = 0; i < 25; i++) {
      let color = i * 2 + 1;
      if (color < 10) {
        color = 10;
      }
      theme.shadows[i] = `0px ${i}px ${i * 2 - 1}px 0px rgba(0, 0, 0, ${color /
        100})`;
    }

    this.theme = new MakiTheme().set(theme);

    // var self = this;

    // const f = () => {
    //  setTimeout(function() {
    //    self.theme = new MakiTheme();
    //    setTimeout(function() {
    //      self.theme = new MakiTheme().set(theme);
    //      f();
    //    }, 3000);
    //  }, 1000);
    // };

    // f();
  }

  _handleDigidCgi() {
    const url = decodeURI(window.location.href);
    const aselectCredentials = url.split('aselect_credentials=')[1].split('&')[0];
    const rid = url.split('rid=')[1].split('&')[0];
    store.dispatch(requestJwtTokenForDigidCgi(aselectCredentials, rid));
  }

  _handleStartJourney() {
    const url = decodeURI(window.location.href);
    const journeyToStart = url.split('name=')[1].split('&')[0];
    var journeyIdToStart = getJourneyId(journeyToStart);

    var foundJourneyToStart;

    if (journeyIdToStart) {
      var journeys = store.getState().journeys.data;

      for (var counter = 0; counter < journeys.length; counter++) {
        var journey = journeys[counter];
        if (journey.request_type_id.toLowerCase() === journeyIdToStart.toLowerCase()) {
          foundJourneyToStart = journey;
          break;
        }
      }
    }

    if (foundJourneyToStart) {
      const isDeepLink = true;
      store.dispatch(setJourney(foundJourneyToStart, isDeepLink));
      store.dispatch(selectPage('journey'));
      store.dispatch(clearAddressData());
    }
  }

  _goHome() {
    store.dispatch(selectPage('home'));
  }

  _goJourneys() {
    store.dispatch(selectPage('journeys'));
  }

  _goLogout() {
    store.dispatch(requestJwtLogout());
  }

  _showTabs(page) {
    return page !== 'signin';
  }

  _isActive(pageName, page) {
    return pageName === page ? ' TabSwitcherTabActive' : '';
  }

  _nope() {
    alert(
      'Deze functie komt binnenkort beschikbaar! Op dit moment wordt er hard gewerkt aan nieuwe functionaliteiten van MijnApp.'
    );
  }

  stateChanged(state) {
    this.page = state.application.page;
    if (
      state.application.page != undefined &&
      state.application.page === 'journeys' &&
      this.shadowRoot != null
    ) {
      this.shadowRoot.querySelector('#journeyScreen').focusOnSearch();
    }
  }

  setFakeJourneys() {
    store.dispatch(setJourneys([
      {
        title: 'Ik heb een goed idee',
        request_type_id: '06daeb7f-6503-4b8e-8aa1-5a5767b53b22',
        preconditions: '',
        overview: {
          needed_documents: [],
          send_to: [],
          steps: [
            'Je geeft aan of je anoniem wilt blijven',
            'Je geeft het onderwerp van je idee op',
            'Je beschrijft het idee',
          ],
          subtitle: 'Leuk dat je een goed idee hebt!',
        },
        questions: [
          {
            id: '6abbb0e1-3ef5-4206-a2e3-aba72ad1259a',
            type: 'single',
            property: 'anoniem',
            options: [
              {
                goto: 'f4efa6ca-158b-4184-958f-52ae8b47f561',
                title: 'Nee',
                value: 'Nee',
              },
              {
                goto: 'b52cf9a7-30d1-4eb7-bf64-34f3a6380c11',
                title: 'Ja',
                value: 'Ja',
              },
            ],
            title: 'Wil je je idee anoniem indienen?',
            subtitle:
                      'Bij anoniem indienen, kunnen we geen contact met je opnemen ' +
                          'bij vragen.',
            optional: {
              goto: null,
            },
          },
          {
            id: 'f4efa6ca-158b-4184-958f-52ae8b47f561',
            type: 'agree',
            property: 'toestemming',
            options: null,
            title: 'Toestemming voor gebruik gegevens',
            subtitle:
                      'Geef je toestemming om jouw voornaam, achternaam en adres mee ' +
                          'te sturen met jouw idee?',
            next: 'e8877860-f3b2-46d2-a3b8-e0b70c93492b',
          },
          {
            id: 'b52cf9a7-30d1-4eb7-bf64-34f3a6380c11',
            type: 'text',
            property: 'ideeomschrijving',
            options: null,
            title: 'Wat is jouw idee?',
            next: '12e51aa9-0a9b-4e74-a273-65e27763073c',
          },
          {
            id: '12e51aa9-0a9b-4e74-a273-65e27763073c',
            type: 'radioButtons',
            property: 'contact',
            options: [
              {
                goto: 'END',
                title: 'Ja',
                value: 'Ja',
              },
              {
                goto: 'END',
                title: 'Nee',
                value: 'Nee',
              },
            ],
            title:
                      'Vind je het prettig dat er contact met je wordt opgenomen ' +
                          'over jouw idee?',
          },
          {
            id: 'e8877860-f3b2-46d2-a3b8-e0b70c93492b',
            type: 'text',
            property: 'ideeomschrijving',
            options: null,
            title: 'Wat is jouw idee?',
            subtitle: '',
            next: 'END',
          },
        ],
        end: {
          check: {
            title: 'Controleer je gegevens',
            subtitle: '',
          },
          success: {
            title: 'Je idee is doorgegeven',
            subtitle: 'Het volgende idee is succesvol verzonden naar de gemeente.',
          },
        },
      },
      {
        title: 'Ik ga verhuizen',
        request_type_id: '9d76fb58-0711-4437-acc4-9f4d9d403cdf',
        preconditions: 'Een verhuizing kan alleen worden doorgegeven door personen vanaf 16 jaar. Raadpleeg je ouder, voogd of verzorger.',
        questions: [
          {
            id: 'a7beef34-9aea-4891-971d-beb67b2e8010',
            type: 'address',
            property: 'adress',
            title: 'Wat wordt je nieuwe adres?',
            subtitle: 'Vul je postcode, huisnummer en eventuele toevoeging in van het nieuwe adres.',
            fieldName: 'nieuw adres',
            fieldIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiANCgkJdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmNWY1ZjU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMzMyOTk5OTQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm5vcm1hbCIgDQoJCQlpZD0icGF0aDUyOTAiIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgLz4NCgk8ZyBpZD0iZzQ3MzgiIHRyYW5zZm9ybT0ibWF0cml4KDAuOCwwLDAsMC44LDYsNikiIHN0eWxlPSJmaWxsOiMxZWJkZDM7ZmlsbC1vcGFjaXR5OjEiPg0KCQk8cGF0aCBkPSJtIDI5Ljk2NDIxMiwyNi4yNzU3IGMgMy4wODgsMCA1LjYsLTIuNTEyOCA1LjYsLTUuNiAwLC0zLjA4NzIgLTIuNTEyLC01LjYgLTUuNiwtNS42IC0zLjA4OCwwIC01LjYsMi41MTI4IC01LjYsNS42IDAsMy4wODcyIDIuNTEyLDUuNiA1LjYsNS42IHogbSAwLC05LjYgYyAyLjIwNTYsMCA0LDEuNzk0NCA0LDQgMCwyLjIwNTYgLTEuNzk0NCw0IC00LDQgLTIuMjA1NiwwIC00LC0xLjc5NDQgLTQsLTQgMCwtMi4yMDU2IDEuNzk0NCwtNCA0LC00IHoiIA0KCQkJCWlkPSJwYXRoNDczMiIgc3R5bGU9InN0cm9rZS13aWR0aDowLjgwMDAwMDAxO2ZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSIgLz4NCgkJPHBhdGggZD0ibSAyOS44MjI2MTIsNDkuMjgxMyAxMi4yNzI4LC0xNy43MjU2IGMgNC42MDMyLC02LjEzNjggMy45Mzc2LC0xNi4yMjQgLTEuNDI0OCwtMjEuNTg1NiAtMi44OTc2LC0yLjg5ODQgLTYuNzUwNCwtNC40OTQ0IC0xMC44NDgsLTQuNDk0NCAtNC4wOTc2LDAgLTcuOTUwNCwxLjU5NiAtMTAuODQ4LDQuNDkzNiAtNS4zNjI0LDUuMzYxNiAtNi4wMjgsMTUuNDQ4OCAtMS40NDMyLDIxLjU2MTYgeiBtIC05LjcxNjgsLTM4LjE4MDggYyAyLjU5NiwtMi41OTUyIDYuMDQ2NCwtNC4wMjQ4IDkuNzE2OCwtNC4wMjQ4IDMuNjcwNCwwIDcuMTIwOCwxLjQyOTYgOS43MTY4LDQuMDI0OCA0Ljg0LDQuODM5MiA1LjQzNiwxMy45NDk2IDEuMjU4NCwxOS41MTkyIGwgLTEwLjk3NTIsMTUuODUwNCAtMTAuOTkyOCwtMTUuODc0NCBjIC00LjE2LC01LjU0NTYgLTMuNTYzMiwtMTQuNjU2IDEuMjc2LC0xOS40OTUyIHoiIA0KCQkJCWlkPSJwYXRoNDczNCIgc3R5bGU9InN0cm9rZS13aWR0aDowLjgwMDAwMDAxO2ZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSIgLz4NCgkJPHBhdGggZD0ibSAzOS42OTM2LDQ0LjcwNTUxOSBjIC0wLjQ0LC0wLjA1MzYgLTAuODM2OCwwLjI2MTYgLTAuODg4LDAuNzAwOCAtMC4wNTEyLDAuNDM5MiAwLjI2MjQsMC44MzY4IDAuNzAwOCwwLjg4OCA4LjQxMjgsMC45OTA0IDEyLjg5MzYsMy42NTkyIDEyLjg5MzYsNS4yMDU2IDAsMi4xNzEyIC04LjUyMTYsNS4yIC0yMi40LDUuMiAtMTMuODc4NCwwIC0yMi40LC0zLjAyODggLTIyLjQsLTUuMiAwLC0xLjU0NjQgNC40ODA4LC00LjIxNTIgMTIuODkzNiwtNS4yMDU2IDAuNDM4NCwtMC4wNTEyIDAuNzUyLC0wLjQ0OTYgMC43MDA4LC0wLjg4OCAtMC4wNTIsLTAuNDM5MiAtMC40NDg4LC0wLjc1NiAtMC44ODgsLTAuNzAwOCAtOC40MjMyLDAuOTkyIC0xNC4zMDY0LDMuNzg1NiAtMTQuMzA2NCw2Ljc5NDQgMCwzLjM3OTIgOC4yNDQsNi44IDI0LDYuOCAxNS43NTYsMCAyNCwtMy40MjA4IDI0LC02LjggMCwtMy4wMDg4IC01Ljg4MzIsLTUuODAyNCAtMTQuMzA2NCwtNi43OTQ0IHoiIA0KCQkJCWlkPSJwYXRoNDczNiIgc3R5bGU9InN0cm9rZS13aWR0aDowLjgwMDAwMDAxO2ZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSIgLz4NCgk8L2c+DQo8L3N2Zz4=',
            next: 'ffefc10d-18fc-4a57-9431-5f7c8e98f1fb',
          },
          {
            id: 'ffefc10d-18fc-4a57-9431-5f7c8e98f1fb',
            type: 'calendar',
            property: 'datum',
            options: null,
            title: 'Wanneer ga je verhuizen?',
            subtitle: 'Kies je verhuisdatum in de onderstaande kalender.',
            fieldName: 'verhuisdatum',
            fieldIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiANCgkJdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmNWY1ZjU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMzMyOTk5OTQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm5vcm1hbCIgDQoJCQlpZD0icGF0aDU0NDMiIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgLz4NCgk8ZyBpZD0iZzU0MzQiIHRyYW5zZm9ybT0ibWF0cml4KDAuNjQsMCwwLDAuNjQsMTAuOCwxMC44KSIgc3R5bGU9ImZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSI+DQoJCTxwYXRoIGQ9Ik0gNTcsNCBIIDUwIFYgMSBDIDUwLDAuNDQ3IDQ5LjU1MywwIDQ5LDAgSCA0MiBDIDQxLjQ0NywwIDQxLDAuNDQ3IDQxLDEgViA0IEggMTkgViAxIEMgMTksMC40NDcgMTguNTUzLDAgMTgsMCBIIDExIEMgMTAuNDQ3LDAgMTAsMC40NDcgMTAsMSBWIDQgSCAzIEMgMi40NDcsNCAyLDQuNDQ3IDIsNSB2IDExIDQzIGMgMCwwLjU1MyAwLjQ0NywxIDEsMSBoIDU0IGMgMC41NTMsMCAxLC0wLjQ0NyAxLC0xIFYgMTYgNSBDIDU4LDQuNDQ3IDU3LjU1Myw0IDU3LDQgWiBNIDQzLDIgaCA1IFYgNSA4IEggNDMgViA1IFogTSAxMiwyIGggNSBWIDUgOCBIIDEyIFYgNSBaIE0gNCw2IGggNiB2IDMgYyAwLDAuNTUzIDAuNDQ3LDEgMSwxIGggNyBjIDAuNTUzLDAgMSwtMC40NDcgMSwtMSBWIDYgaCAyMiB2IDMgYyAwLDAuNTUzIDAuNDQ3LDEgMSwxIGggNyBjIDAuNTUzLDAgMSwtMC40NDcgMSwtMSBWIDYgaCA2IHYgOSBIIDQgWiBNIDQsNTggViAxNyBoIDUyIHYgNDEgeiIJDQoJCQkJaWQ9InBhdGg1NDMwIiBzdHlsZT0iZmlsbDojMWViZGQzO2ZpbGwtb3BhY2l0eToxIiAvPg0KCQk8cGF0aCBkPSJtIDM4LDIzIGggLTcgLTIgLTcgLTIgLTkgdiA5IDIgNyAyIDkgaCA5IDIgNyAyIDcgMiA5IHYgLTkgLTIgLTcgLTIgLTkgaCAtOSB6IG0gLTcsMiBoIDcgdiA3IGggLTcgeiBtIDcsMTYgaCAtNyB2IC03IGggNyB6IE0gMjIsMzQgaCA3IHYgNyBoIC03IHogbSAwLC05IGggNyB2IDcgaCAtNyB6IG0gLTksMCBoIDcgdiA3IGggLTcgeiBtIDAsOSBoIDcgdiA3IGggLTcgeiBtIDcsMTYgaCAtNyB2IC03IGggNyB6IG0gOSwwIGggLTcgdiAtNyBoIDcgeiBtIDksMCBoIC03IHYgLTcgaCA3IHogbSA5LDAgaCAtNyB2IC03IGggNyB6IG0gMCwtOSBoIC03IHYgLTcgaCA3IHogbSAwLC0xNiB2IDcgaCAtNyB2IC03IHoiCQ0KCQkJCWlkPSJwYXRoNTQzMiIgc3R5bGU9ImZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSIgLz4NCgk8L2c+DQo8L3N2Zz4=',
            next: '37e30b1f-fb51-4d49-8756-fa5d4d55829a',
          },
          {
            id: '37e30b1f-fb51-4d49-8756-fa5d4d55829a',
            type: 'personsMoving',
            property: 'wie',
            title: 'Met wie ga je verhuizen?',
            subtitle:
                      'Er wordt een bericht gestuurd naar de persoon die meeverhuist ' +
                      '(onderstaande personen staan nu op hetzelfde adres als jij ' +
                      'ingeschreven)',
            fieldName: 'meeverhuizende personen',
            fieldIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiANCgkJdmlld0JveD0iMCAwIDUwNS40IDUwNS40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDUuNCA1MDUuNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmNWY1ZjU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMzMyOTk5OTQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm5vcm1hbCIgDQoJCQlpZD0icGF0aDU0MDciIGN4PSIyNTIuNyIgY3k9IjI1Mi43IiByPSIyNTIuNyIgLz4NCgk8ZyBpZD0iZzUzOTgiIHRyYW5zZm9ybT0ibWF0cml4KDAuOCwwLDAsMC44LDUwLjU0LDUwLjU0KSIgc3R5bGU9ImZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSI+DQoJCTxwYXRoIGQ9Im0gNDM3LjEsMjMzLjQ1IGMgMTQuOCwtMTAuNCAyNC42LC0yNy43IDI0LjYsLTQ3LjIgMCwtMzEuOSAtMjUuOCwtNTcuNyAtNTcuNywtNTcuNyAtMzEuOSwwIC01Ny43LDI1LjggLTU3LjcsNTcuNyAwLDE5LjUgOS43LDM2LjggMjQuNiw0Ny4yIC0xMi43LDQuNCAtMjQuMywxMS4yIC0zNC4xLDIwIC0xMy41LC0xMS41IC0yOS40LC0yMC4zIC00Ni44LC0yNS41IDIxLjEsLTEyLjggMzUuMywtMzYuMSAzNS4zLC02Mi42IDAsLTQwLjQgLTMyLjcsLTczLjEgLTczLjEsLTczLjEgLTQwLjQsMCAtNzMuMSwzMi44IC03My4xLDczLjEgMCwyNi41IDE0LjEsNDkuOCAzNS4zLDYyLjYgLTE3LjIsNS4yIC0zMi45LDEzLjkgLTQ2LjMsMjUuMiAtOS44LC04LjYgLTIxLjIsLTE1LjMgLTMzLjcsLTE5LjYgMTQuOCwtMTAuNCAyNC42LC0yNy43IDI0LjYsLTQ3LjIgMCwtMzEuOSAtMjUuOCwtNTcuNyAtNTcuNywtNTcuNyAtMzEuOSwwIC01Ny43LDI1LjggLTU3LjcsNTcuNyAwLDE5LjUgOS43LDM2LjggMjQuNiw0Ny4yIEMgMjguNSwyNDcuMjUgMCwyODQuOTUgMCwzMjkuMjUgdiA2LjYgYyAwLDAuMiAwLjIsMC40IDAuNCwwLjQgaCAxMjIuMyBjIC0wLjcsNS41IC0xLjEsMTEuMiAtMS4xLDE2LjkgdiA2LjggYyAwLDI5LjQgMjMuOCw1My4yIDUzLjIsNTMuMiBoIDE1NSBjIDI5LjQsMCA1My4yLC0yMy44IDUzLjIsLTUzLjIgdiAtNi44IGMgMCwtNS43IC0wLjQsLTExLjQgLTEuMSwtMTYuOSBIIDUwNSBjIDAuMiwwIDAuNCwtMC4yIDAuNCwtMC40IHYgLTYuNiBjIC0wLjIsLTQ0LjQgLTI4LjYsLTgyLjEgLTY4LjMsLTk1LjggeiBtIC03NC44LC00Ny4zIGMgMCwtMjMgMTguNywtNDEuNyA0MS43LC00MS43IDIzLDAgNDEuNywxOC43IDQxLjcsNDEuNyAwLDIyLjcgLTE4LjMsNDEuMiAtNDAuOSw0MS43IC0wLjMsMCAtMC41LDAgLTAuOCwwIC0wLjMsMCAtMC41LDAgLTAuOCwwIC0yMi43LC0wLjQgLTQwLjksLTE4LjkgLTQwLjksLTQxLjcgeiBtIC0xNjcuNCwtMjAuOCBjIDAsLTMxLjUgMjUuNiwtNTcuMSA1Ny4xLC01Ny4xIDMxLjUsMCA1Ny4xLDI1LjYgNTcuMSw1Ny4xIDAsMzAuNCAtMjMuOSw1NS4zIC01My44LDU3IC0xLjEsMCAtMi4yLDAgLTMuMywwIC0xLjEsMCAtMi4yLDAgLTMuMywwIC0yOS45LC0xLjcgLTUzLjgsLTI2LjYgLTUzLjgsLTU3IHogbSAtMTM1LjYsMjAuOCBjIDAsLTIzIDE4LjcsLTQxLjcgNDEuNywtNDEuNyAyMywwIDQxLjcsMTguNyA0MS43LDQxLjcgMCwyMi43IC0xOC4zLDQxLjIgLTQwLjksNDEuNyAtMC4zLDAgLTAuNSwwIC0wLjgsMCAtMC4zLDAgLTAuNSwwIC0wLjgsMCAtMjIuNiwtMC40IC00MC45LC0xOC45IC00MC45LC00MS43IHogbSA2Ni4yLDEzNCBIIDE2LjIgYyA0LjUsLTQyLjYgNDAuNSwtNzYgODQuMiwtNzYuMyAwLjIsMCAwLjQsMCAwLjYsMCAwLjIsMCAwLjQsMCAwLjYsMCAyMC44LDAuMSAzOS44LDcuOCA1NC41LDIwLjMgLTE0LjQsMTUuNiAtMjUuMSwzNC44IC0zMC42LDU2IHogbSAyNDEuMywzOS44IGMgMCwyMC41IC0xNi43LDM3LjIgLTM3LjIsMzcuMiBoIC0xNTUgYyAtMjAuNSwwIC0zNy4yLC0xNi43IC0zNy4yLC0zNy4yIHYgLTYuOCBjIDAsLTYyLjEgNDkuNiwtMTEyLjkgMTExLjMsLTExNC43IDEuMSwwLjEgMi4zLDAuMSAzLjQsMC4xIDEuMSwwIDIuMywwIDMuNCwtMC4xIDYxLjcsMS44IDExMS4zLDUyLjYgMTExLjMsMTE0LjcgdiA2LjggeiBtIDExLjksLTM5LjggYyAtNS41LC0yMS4xIC0xNiwtNDAgLTMwLjMsLTU1LjYgMTQuOCwtMTIuOCAzNCwtMjAuNSA1NSwtMjAuNyAwLjIsMCAwLjQsMCAwLjYsMCAwLjIsMCAwLjQsMCAwLjYsMCA0My43LDAuMyA3OS43LDMzLjcgODQuMiw3Ni4zIHoiIA0KCQkJCWlkPSJwYXRoNTM5NiIgc3R5bGU9ImZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSIgLz4NCgk8L2c+DQo8L3N2Zz4=',
            next: '51e58c64-eabb-4288-af4c-2080d9e3b71f',
          },
          {
            id: '51e58c64-eabb-4288-af4c-2080d9e3b71f',
            type: 'multipleText',
            property: 'contactinfo',
            title: 'Hoe kunnen we je bereiken?',
            subtitle: 'Vul je e-mailadres en/of je telefoonnummer in',
            options: [
              {
                title: 'E-mailadres',
                value: 'email',
                pattern: '\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}\\b',
                patternValidationErrorMessage: 'Vul hier een geldig e-mailadres in',
              },
              {
                title: 'Telefoonnummer',
                value: 'tel',
                pattern: '([-.0-9 ])*\\d',
                patternValidationErrorMessage: 'Gebruik alleen cijfers bij het invullen',
              },
            ],
            fieldName: 'contactinformatie',
            fieldIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgaWQ9Im1pam5BcHBfdXNlciIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0ODAgNDgwIiANCgkJc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgwIDQ4MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmNWY1ZjU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuOTczNTQzMTc7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5OjIuOTczNTQzMzEsIDguOTIwNjI5OTE5OTk5OTk3ODg7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm5vcm1hbCIgDQoJCQlpZD0icGF0aDQ1MDgiIGN4PSIyNDAiIGN5PSIyNDAiIHI9IjI0MCIvPg0KCTxwYXRoIGQ9Ik0gMjM5Ljk5MzUsNDggQyAxMzMuOTU2LDQ4IDQ3Ljk5MzUwMywxMzMuOTYyNSA0Ny45OTM1MDMsMjQwIGMgMCwxMDYuMDM3NSA4NS45NjI0OTcsMTkyIDE5MS45OTk5OTcsMTkyIDUuNzg0MzgsMCAxMS41NDY4OCwtMC4yNTkzOCAxNy4yODEyNSwtMC43NzUgNS4zMzEyNSwtMC40NzgxMiAxMC42MTU2MywtMS4yMDkzOCAxNS44NTkzOCwtMi4xMjUgbCAyLjAxNTYyLC0wLjM1NjI1IEMgMzcyLjY0MDM4LDQxMC41NSA0NDAuMjM3MjUsMzIxLjEwMzEyIDQzMS4xMTg1LDIyMi4zNDY4OCA0MjEuOTk5NzUsMTIzLjU5MDYyIDMzOS4xNjg1LDQ4LjAzMTI1IDIzOS45OTM1LDQ4IFogbSAtMTUuNDI1LDM3MC41MjE4OCBoIC0wLjQ1MzEyIGMgLTQuOTc4MTMsLTAuNDQwNjMgLTkuOTE4NzUsLTEuMTA2MjYgLTE0LjgxNTYzLC0xLjk1OTM4IC0wLjI4MTI1LC0wLjA1IC0wLjU2MjUsLTAuMDgxMyAtMC44Mzc1LC0wLjEzNDM4IC00Ljc4NzUsLTAuODU2MjQgLTkuNTI1LC0xLjkxODc0IC0xNC4yMTU2MiwtMy4xNTkzNyBsIC0xLjEzNDM4LC0wLjI5MDYzIGMgLTQuNTc1LC0xLjI0MDYyIC05LjEsLTIuNjgxMjQgLTEzLjU1OTM3LC00LjI4MTI0IC0wLjQ2MjUsLTAuMTY1NjMgLTAuOTI4MTMsLTAuMzEyNSAtMS4zOTA2MywtMC40ODQzOCAtNC4zNzE4NywtMS42MDYyNSAtOC42NjU2MiwtMy40MDYyNSAtMTIuODkzNzUsLTUuMzUzMTIgLTAuNTI1LC0wLjIzNDM4IC0xLjA1LC0wLjQ1OTM4IC0xLjU3NSwtMC43MDkzOCAtNC4xNDY4NywtMS45MTg3NSAtOC4yMTI1LC00LjA4MTI1IC0xMi4yLC02LjM1NjI1IC0wLjU2MjUsLTAuMzE4NzUgLTEuMTMxMjUsLTAuNjM3NSAtMS42OTM3NSwtMC45NTMxMyAtMy45MjUsLTIuMjkwNjIgLTcuNzU5MzcsLTQuNzQ2ODcgLTExLjUyMTg3LC03LjM0MDYyIC0wLjU2ODc1LC0wLjM5Njg4IC0xLjE0Mzc1LC0wLjc4MTI1IC0xLjcwOTM4LC0xLjE3ODEyIC0zLjY5Njg3LC0yLjYyMTg4IC03LjMsLTUuNDA2MjYgLTEwLjgwOTM3LC04LjMxODc2IGwgLTAuOTY1NjMsLTAuODQzNzQgViAzMjMuMiBjIDAuMDQ2OSwtMzguODYyNSAzMS41Mzc1LC03MC4zNTMxMiA3MC40LC03MC40IGggODkuNiBjIDM4Ljg2MjUsMC4wNDY5IDcwLjM1MzEzLDMxLjUzNzUgNzAuNCw3MC40IHYgNTMuOTY1NjIgbCAtMC44NSwwLjcwOTM4IGMgLTMuNTc4MTIsMi45ODc1IC03LjI1LDUuODEyNSAtMTEuMDIxODcsOC40ODEyNSAtMC41LDAuMzUgLTEuMDA2MjUsMC42ODQzNyAtMS41MDMxMywxLjAyODEzIC0zLjgwNjI1LDIuNjQzNzQgLTcuNzA2MjUsNS4xMzEyNCAtMTEuNyw3LjQ2ODc0IC0wLjUsMC4yOTA2MyAtMS4wMTI1LDAuNTY1NjMgLTEuNTA5MzcsMC44NTMxMyAtNC4wNDY4OCwyLjMwMzEzIC04LjE2MjUsNC40NzgxMyAtMTIuMzU5MzgsNi40Mzc1IC0wLjQ4MTI1LDAuMjI1IC0wLjk2NTYyLDAuNDM0MzcgLTEuNDUzMTIsMC42NDA2MyAtNC4yNjI1LDEuOTY1NjIgLTguNTkzNzUsMy43NzUgLTEyLjk5Njg4LDUuMzkzNzQgLTAuNDM3NSwwLjE2MjUgLTAuODc4MTIsMC4zMDMxMyAtMS4yODEyNSwwLjQ1NjI2IC00LjQ4MTI1LDEuNjA2MjQgLTkuMDI1LDMuMDU5MzcgLTEzLjYyNSw0LjMwNjI0IGwgLTEuMTAzMTIsMC4yNzUgYyAtNC42OTY4OCwxLjI0MDYzIC05LjQzNzUsMi4zMDkzOCAtMTQuMjMxMjUsMy4xNjg3NiAtMC4yNzUsMC4wNSAtMC41NSwwLjA4NDQgLTAuODI1LDAuMTI4MTIgLTQuOTAzMTMsMC44NTYyNSAtOS44NSwxLjUyMTg4IC0xNC44MzEyNSwxLjk2NTYyIGggLTAuNDUzMTMgYyAtNS4xMTg3NSwwLjQ0MDYzIC0xMC4yNDA2MiwwLjY3ODEzIC0xNS40MjUsMC42NzgxMyAtNS4xODQzNywwIC0xMC4zNDY4NywtMC4xOTM3NSAtMTUuNDU2MjUsLTAuNjM0MzcgeiBNIDM2Ny45OTM1LDM2NS4zIHYgLTQyLjEgYyAtMC4wNTMxLC00NS45MjgxMiAtMzcuMjcxODcsLTgzLjE0Njg4IC04My4yLC04My4yIGggLTg5LjYgYyAtNDUuOTI4MTIsMC4wNTMxIC04My4xNDY4NywzNy4yNzE4OCAtODMuMiw4My4yIHYgNDIuMDkzNzUgYyAtNjguOTMxMjQ2LC03MC4zNTMxMyAtNjguMTYyNDk3LC0xODMuMTUgMS43MTg3NSwtMjUyLjU1OTM3IDY5Ljg4MTI1LC02OS40MDYyNTUgMTgyLjY4MTI1LC02OS40MDYyNTUgMjUyLjU2MjUsMCA2OS44ODEyNSw2OS40MDkzNyA3MC42NSwxODIuMjA2MjQgMS43MTg3NSwyNTIuNTU5MzcgeiBtIDAsMCIgDQoJCQlpZD0icGF0aDIiIHN0eWxlPSJzdHJva2Utd2lkdGg6MC44MDAwMDAwMTtmaWxsOiMxZWJkZDM7ZmlsbC1vcGFjaXR5OjEiLz4NCgk8cGF0aCBkPSJtIDI0MCw4MCBjIC0zNS4zNDY4OCwwIC02NCwyOC42NTMxMiAtNjQsNjQgMCwzNS4zNDY4OCAyOC42NTMxMiw2NCA2NCw2NCAzNS4zNDY4OCwwIDY0LC0yOC42NTMxMiA2NCwtNjQgLTAuMDM3NSwtMzUuMzMxMjUgLTI4LjY2ODc1LC02My45NjI1IC02NCwtNjQgeiBtIDAsMTE1LjIgYyAtMjguMjc4MTIsMCAtNTEuMiwtMjIuOTIxODggLTUxLjIsLTUxLjIgMCwtMjguMjc4MTIgMjIuOTIxODgsLTUxLjIgNTEuMiwtNTEuMiAyOC4yNzgxMiwwIDUxLjIsMjIuOTIxODggNTEuMiw1MS4yIC0wLjAzMTIsMjguMjYyNSAtMjIuOTM3NSw1MS4xNjg3NSAtNTEuMiw1MS4yIHogbSAwLDAiIA0KCQkJaWQ9InBhdGg0IiBzdHlsZT0ic3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNzk5ODAwMDQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtmaWxsOiMxZWJkZDM7ZmlsbC1vcGFjaXR5OjEiLz4NCjwvc3ZnPg==',
            next: 'END', // '21586109-ce3b-4091-8420-85f92c0a6c11',
          },
          // {
          //  id: '21586109-ce3b-4091-8420-85f92c0a6c11',
          //  property: 'eigenaar',
          //  type: 'single',
          //  options: [
          //    {
          //      goto: 'END',
          //      title: 'Ja',
          //      value: null,
          //    },
          //    {
          //      goto: 'END',
          //      title: 'Nee, ik ga huren',
          //      value: null,
          //    },
          //    {
          //      goto: '10af45ba-b96c-44cc-865e-5f5342e0b793',
          //      title: 'Nee, ik ga inwonen',
          //      value: null,
          //    },
          //  ],
          //  title: 'Ben of word je eigenaar van de woning?',
          // },
          // {
          //  id: '10af45ba-b96c-44cc-865e-5f5342e0b793',
          //  type: 'agree',
          //  property: 'toestemmingeigenaar',
          //  options: null,
          //  title: 'Is de eigenaar akkoord met inwoning?',
          //  subtitle:
          //    'De eigenaar ontvangt een notificatie in MijnApp ter goedkeuring.',
          //  next: 'END',
          // },
        ],
        overview: {
          needed_documents: [],
          send_to: [],
          steps: [
            'Geef je nieuwe adres op',
            'Geef de datum op wanneer je gaat verhuizen',
            'Geef aan met wie je gaat verhuizen',
            'Geef aan hoe we je kunnen bereiken',
            // 'Geef de nieuwe woonsituatie aan',
          ],
          subtitle: 'Verhuizen binnen of naar gemeente \'s-Hertogenbosch',
        },
        end: {
          check: {
            title: 'Controleer je gegevens',
            subtitle: '',
          },
          success: {
            title: 'Je verhuizing is aangevraagd',
            subtitle: 'De volgende gegevens zijn succesvol verzonden naar de gemeente.',
          },
        },
        stopUrl: 'https://www.s-hertogenbosch.nl/verhuizen',
        successUrl: 'https://www.s-hertogenbosch.nl/verhuizen',
      },
    ]));
  }
}

window.customElements.define('maf-app', MafApp);
