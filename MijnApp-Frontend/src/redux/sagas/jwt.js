import { call, put, takeLatest } from 'redux-saga/effects';
import { jwtApi } from '../api/jwt';
import { jwtBearerToken, removeJwtBearerToken } from '../helpers/headers';
import { selectPage, selectPageNoHistory, nextPageAfterLogin } from '../actions/application';
import { setLastAction, removeLastAction } from '../helpers/lastAction';
import { setJourneys } from '../actions/journeys';

import {
  REQUEST_JWT_SIGNIN_FAKE,
  REQUEST_JWT_SIGNIN,
  requestJwtSigninSuccessFake,
  requestJwtSigninSuccess,
  requestJwtSigninFailure,
  REQUEST_JWT_LOGOUT,
  REQUEST_JWT_LOGOUT_401,
  REQUEST_JWT_SIGNIN_SUCCESS,
  REQUEST_JWT_SIGNIN_SUCCESS_FAKE,
  REQUEST_JWT_FOR_DIGIDCGI, REQUEST_JWT_FOR_DIGIDCGI_SUCCESS,
  requestJwtTokenForDigidSuccess, requestJwtTokenForDigidFailure,
  requestJwtLogoutSuccess,
} from '../actions/jwt';


export function* watchRequestJwtSigninFake() {
  yield takeLatest(REQUEST_JWT_SIGNIN_FAKE, fetchJwtSigninFake);
}

function* fetchJwtSigninFake() {
  try {
    const result = yield call(jwtApi.signinfake());
    yield put(requestJwtSigninSuccessFake(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtSigninFailure(e));
  }
}

export function* watchRequestJwtSignin() {
  yield takeLatest(REQUEST_JWT_SIGNIN, fetchJwtSignin);
}

function* fetchJwtSignin() {
  try {
    const result = yield call(jwtApi.signin());
    yield put(requestJwtSigninSuccess(result.data, result.headers));
  } catch (e) {
    yield put(requestJwtSigninFailure(e));
  }
}

export function* watchJwtSigninSuccess() {
  yield takeLatest(REQUEST_JWT_SIGNIN_SUCCESS, onJwtSigninSuccess);
}

export function* watchJwtSigninSuccessFake() {
  yield takeLatest(REQUEST_JWT_SIGNIN_SUCCESS_FAKE, onJwtSigninSuccessFake);
}

function onJwtSigninSuccess(action) {
  window.location = action.data.redirectTo;
  setFakeJourneys();
}

function* onJwtSigninSuccessFake() {
  yield put(nextPageAfterLogin());
  yield setFakeJourneys();
}

export function* watchRequestJwtFromDigidCgi() {
  yield takeLatest(REQUEST_JWT_FOR_DIGIDCGI, fetchJwtFromDigidCgi);
}

function* fetchJwtFromDigidCgi(action) {
  try {
    const result = yield call(jwtApi.getJwtForDigidCgi(action.aselectCredentials, action.rid));
    yield put(requestJwtTokenForDigidSuccess(result.data, result.headers));
    setFakeJourneys();
  } catch (e) {
    yield put(requestJwtTokenForDigidFailure(e));
  }
}

export function* watchRequestJwtFromDigidCgiSuccess() {
  yield takeLatest(REQUEST_JWT_FOR_DIGIDCGI_SUCCESS, onJwtFromDigidCgiSuccess);
}

function* onJwtFromDigidCgiSuccess() {
  yield put(nextPageAfterLogin());
}

export function* watchRequestJwtLogout() {
  yield takeLatest(REQUEST_JWT_LOGOUT, doJwtLogout);
}

function* doJwtLogout() {
  yield call(jwtApi.logout(jwtBearerToken()));
  yield put(requestJwtLogoutSuccess());
  removeJwtBearerToken();
  removeLastAction();
  window.successToast.text = 'Succesvol uitgelogd';
  window.successToast.open();
  yield put(selectPage('signin'));
}

export function* watchRequestJwtLogout401() {
  yield takeLatest(REQUEST_JWT_LOGOUT_401, doJwtLogout401);
}

function* doJwtLogout401(action) {
  removeJwtBearerToken();
  if (action && action.lastActionBefore401) {
    setLastAction(action.lastActionBefore401);
  }
  window.clearErrorDialog();
  window.errorText.innerHTML = `U heeft geen geldige sessie meer en zult opnieuw moeten inloggen.`;
  window.errorDialog.open();
  // Here we do a selectPageNoHistory, so that when the user logs in again, he is navigated to were he was.
  yield put(selectPageNoHistory('signin'));
}

function* setFakeJourneys() {
  yield put(setJourneys([
    {
      title: 'Ik heb een goed idee',
      request_type_id: '06daeb7f-6503-4b8e-8aa1-5a5767b53b22',
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
      overview: {
        needed_documents: ['Geen'],
        send_to: [],
        steps: [
          'Je geeft aan of je anoniem wilt blijven',
          'Je geeft het onderwerp van je idee op',
          'Je beschrijft het idee',
        ],
        subtitle: 'Leuk dat je een goed idee hebt!',
      },
      end: {
        check: {
          title: 'Controleer je gegevens',
          subtitle: 'Controleer onderstaande gegevens goed en verzend het formulier.',
        },
        success: {
          title: 'Je idee is doorgegeven',
          subtitle: 'Het volgende idee is succesvol verzonden naar de gemeente.',
        }
      },
    },
    {
      title: 'Ik ga verhuizen',
      request_type_id: 'fc79c4c9-b3b3-4258-bdbb-449262f3e5d7',
      questions: [
        {
          id: 'a7beef34-9aea-4891-971d-beb67b2e8010',
          type: 'address',
          property: 'adress',
          title: 'Wat wordt je nieuwe adres?',
          subtitle: 'Vul je postcode, huisnummer en eventueel toevoeging in van het nieuwe adres.',
          next: 'ffefc10d-18fc-4a57-9431-5f7c8e98f1fb',
        },
        {
          id: 'ffefc10d-18fc-4a57-9431-5f7c8e98f1fb',
          type: 'calendar',
          property: 'ingangsdatum',
          options: null,
          title: 'Wanneer ga je verhuizen?',
          subtitle: 'Kies je verhuisdatum in de onderstaande kalender.',
          next: '37e30b1f-fb51-4d49-8756-fa5d4d55829a',
        },
        {
          id: '37e30b1f-fb51-4d49-8756-fa5d4d55829a',
          type: 'personsMoving',
          property: 'meeverhuizers',
          title: 'Met wie ga je verhuizen?',
          subtitle:
            'Er wordt een bericht gestuurd naar de persoon die meeverhuist ' +
            '(onderstaande personen staan nu op hetzelfde adres als jij ' +
            'ingeschreven)',
          next: 'END', // '21586109-ce3b-4091-8420-85f92c0a6c11',
        },
        //{
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
        //},
        //{
        //  id: '10af45ba-b96c-44cc-865e-5f5342e0b793',
        //  type: 'agree',
        //  property: 'toestemmingeigenaar',
        //  options: null,
        //  title: 'Is de eigenaar akkoord met inwoning?',
        //  subtitle:
        //    'De eigenaar ontvangt een notificatie in MijnApp ter goedkeuring.',
        //  next: 'END',
        //},
      ],
      overview: {
        needed_documents: ['Geen documenten nodig'],
        send_to: [],
        steps: [
          'Geef je nieuwe adres op',
          'Geef de datum op wanneer je gaat verhuizen',
          'Geef aan met wie je gaat verhuizen',
          //'Geef de nieuwe woonsituatie aan',
        ],
        subtitle: 'Verhuizen binnen of naar gemeente \'s-Hertogenbosch',
      },
      end: {
        check: {
          title: 'Controleer je gegevens',
          subtitle: 'Controleer onderstaande gegevens goed en verzend het formulier.',
        },
        success: {
          title: 'Je verhuizing is aangevraagd',
          subtitle: 'De volgende gegevens zijn succesvol verzonden naar de gemeente.',
        }
      },
    },
  ]));
}