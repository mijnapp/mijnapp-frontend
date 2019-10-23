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
  } catch (e) {
    yield put(requestJwtTokenForDigidFailure(e));
  }
}

export function* watchRequestJwtFromDigidCgiSuccess() {
  yield takeLatest(REQUEST_JWT_FOR_DIGIDCGI_SUCCESS, onJwtFromDigidCgiSuccess);
}

function* onJwtFromDigidCgiSuccess() {
  yield put(nextPageAfterLogin());
  yield setFakeJourneys();
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
      request_type_id: '9d76fb58-0711-4437-acc4-9f4d9d403cdf',
      questions: [
        {
          id: 'a7beef34-9aea-4891-971d-beb67b2e8010',
          type: 'address',
          property: 'adress',
          title: 'Wat wordt je nieuwe adres?',
          subtitle: 'Vul je postcode, huisnummer en eventuele toevoeging in van het nieuwe adres.',
          fieldName: 'nieuw adres',
          fieldIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNjAgNjAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYwIDYwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNMzAsMjZjMy44NiwwLDctMy4xNDEsNy03cy0zLjE0LTctNy03cy03LDMuMTQxLTcsN1MyNi4xNCwyNiwzMCwyNnogTTMwLDE0YzIuNzU3LDAsNSwyLjI0Myw1LDVzLTIuMjQzLDUtNSw1DQoJCXMtNS0yLjI0My01LTVTMjcuMjQzLDE0LDMwLDE0eiIvPg0KCTxwYXRoIGQ9Ik0yOS44MjMsNTQuNzU3TDQ1LjE2NCwzMi42YzUuNzU0LTcuNjcxLDQuOTIyLTIwLjI4LTEuNzgxLTI2Ljk4MkMzOS43NjEsMS45OTUsMzQuOTQ1LDAsMjkuODIzLDANCgkJcy05LjkzOCwxLjk5NS0xMy41Niw1LjYxN2MtNi43MDMsNi43MDItNy41MzUsMTkuMzExLTEuODA0LDI2Ljk1MkwyOS44MjMsNTQuNzU3eiBNMTcuNjc3LDcuMDMxQzIwLjkyMiwzLjc4NywyNS4yMzUsMiwyOS44MjMsMg0KCQlzOC45MDEsMS43ODcsMTIuMTQ2LDUuMDMxYzYuMDUsNi4wNDksNi43OTUsMTcuNDM3LDEuNTczLDI0LjM5OUwyOS44MjMsNTEuMjQzTDE2LjA4MiwzMS40DQoJCUMxMC44ODIsMjQuNDY4LDExLjYyOCwxMy4wOCwxNy42NzcsNy4wMzF6Ii8+DQoJPHBhdGggZD0iTTQyLjExNyw0My4wMDdjLTAuNTUtMC4wNjctMS4wNDYsMC4zMjctMS4xMSwwLjg3NnMwLjMyOCwxLjA0NiwwLjg3NiwxLjExQzUyLjM5OSw0Ni4yMzEsNTgsNDkuNTY3LDU4LDUxLjUNCgkJYzAsMi43MTQtMTAuNjUyLDYuNS0yOCw2LjVTMiw1NC4yMTQsMiw1MS41YzAtMS45MzMsNS42MDEtNS4yNjksMTYuMTE3LTYuNTA3YzAuNTQ4LTAuMDY0LDAuOTQtMC41NjIsMC44NzYtMS4xMQ0KCQljLTAuMDY1LTAuNTQ5LTAuNTYxLTAuOTQ1LTEuMTEtMC44NzZDNy4zNTQsNDQuMjQ3LDAsNDcuNzM5LDAsNTEuNUMwLDU1LjcyNCwxMC4zMDUsNjAsMzAsNjBzMzAtNC4yNzYsMzAtOC41DQoJCUM2MCw0Ny43MzksNTIuNjQ2LDQ0LjI0Nyw0Mi4xMTcsNDMuMDA3eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=',
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
          fieldIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNjAgNjAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYwIDYwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNNTcsNGgtN1YxYzAtMC41NTMtMC40NDctMS0xLTFoLTdjLTAuNTUzLDAtMSwwLjQ0Ny0xLDF2M0gxOVYxYzAtMC41NTMtMC40NDctMS0xLTFoLTdjLTAuNTUzLDAtMSwwLjQ0Ny0xLDF2M0gzDQoJCUMyLjQ0Nyw0LDIsNC40NDcsMiw1djExdjQzYzAsMC41NTMsMC40NDcsMSwxLDFoNTRjMC41NTMsMCwxLTAuNDQ3LDEtMVYxNlY1QzU4LDQuNDQ3LDU3LjU1Myw0LDU3LDR6IE00MywyaDV2M3YzaC01VjVWMnogTTEyLDJoNQ0KCQl2M3YzaC01VjVWMnogTTQsNmg2djNjMCwwLjU1MywwLjQ0NywxLDEsMWg3YzAuNTUzLDAsMS0wLjQ0NywxLTFWNmgyMnYzYzAsMC41NTMsMC40NDcsMSwxLDFoN2MwLjU1MywwLDEtMC40NDcsMS0xVjZoNnY5SDRWNnoNCgkJIE00LDU4VjE3aDUydjQxSDR6Ii8+DQoJPHBhdGggZD0iTTM4LDIzaC03aC0yaC03aC0yaC05djl2MnY3djJ2OWg5aDJoN2gyaDdoMmg5di05di0ydi03di0ydi05aC05SDM4eiBNMzEsMjVoN3Y3aC03VjI1eiBNMzgsNDFoLTd2LTdoN1Y0MXogTTIyLDM0aDd2N2gtNw0KCQlWMzR6IE0yMiwyNWg3djdoLTdWMjV6IE0xMywyNWg3djdoLTdWMjV6IE0xMywzNGg3djdoLTdWMzR6IE0yMCw1MGgtN3YtN2g3VjUweiBNMjksNTBoLTd2LTdoN1Y1MHogTTM4LDUwaC03di03aDdWNTB6IE00Nyw1MGgtNw0KCQl2LTdoN1Y1MHogTTQ3LDQxaC03di03aDdWNDF6IE00NywyNXY3aC03di03SDQ3eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=',
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
          fieldIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTA1LjQgNTA1LjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwNS40IDUwNS40OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTQzNy4xLDIzMy40NWMxNC44LTEwLjQsMjQuNi0yNy43LDI0LjYtNDcuMmMwLTMxLjktMjUuOC01Ny43LTU3LjctNTcuN2MtMzEuOSwwLTU3LjcsMjUuOC01Ny43LDU3LjcNCgkJCWMwLDE5LjUsOS43LDM2LjgsMjQuNiw0Ny4yYy0xMi43LDQuNC0yNC4zLDExLjItMzQuMSwyMGMtMTMuNS0xMS41LTI5LjQtMjAuMy00Ni44LTI1LjVjMjEuMS0xMi44LDM1LjMtMzYuMSwzNS4zLTYyLjYNCgkJCWMwLTQwLjQtMzIuNy03My4xLTczLjEtNzMuMWMtNDAuNCwwLTczLjEsMzIuOC03My4xLDczLjFjMCwyNi41LDE0LjEsNDkuOCwzNS4zLDYyLjZjLTE3LjIsNS4yLTMyLjksMTMuOS00Ni4zLDI1LjINCgkJCWMtOS44LTguNi0yMS4yLTE1LjMtMzMuNy0xOS42YzE0LjgtMTAuNCwyNC42LTI3LjcsMjQuNi00Ny4yYzAtMzEuOS0yNS44LTU3LjctNTcuNy01Ny43cy01Ny43LDI1LjgtNTcuNyw1Ny43DQoJCQljMCwxOS41LDkuNywzNi44LDI0LjYsNDcuMkMyOC41LDI0Ny4yNSwwLDI4NC45NSwwLDMyOS4yNXY2LjZjMCwwLjIsMC4yLDAuNCwwLjQsMC40aDEyMi4zYy0wLjcsNS41LTEuMSwxMS4yLTEuMSwxNi45djYuOA0KCQkJYzAsMjkuNCwyMy44LDUzLjIsNTMuMiw1My4yaDE1NWMyOS40LDAsNTMuMi0yMy44LDUzLjItNTMuMnYtNi44YzAtNS43LTAuNC0xMS40LTEuMS0xNi45SDUwNWMwLjIsMCwwLjQtMC4yLDAuNC0wLjR2LTYuNg0KCQkJQzUwNS4yLDI4NC44NSw0NzYuOCwyNDcuMTUsNDM3LjEsMjMzLjQ1eiBNMzYyLjMsMTg2LjE1YzAtMjMsMTguNy00MS43LDQxLjctNDEuN3M0MS43LDE4LjcsNDEuNyw0MS43DQoJCQljMCwyMi43LTE4LjMsNDEuMi00MC45LDQxLjdjLTAuMywwLTAuNSwwLTAuOCwwcy0wLjUsMC0wLjgsMEMzODAuNSwyMjcuNDUsMzYyLjMsMjA4Ljk1LDM2Mi4zLDE4Ni4xNXogTTE5NC45LDE2NS4zNQ0KCQkJYzAtMzEuNSwyNS42LTU3LjEsNTcuMS01Ny4xczU3LjEsMjUuNiw1Ny4xLDU3LjFjMCwzMC40LTIzLjksNTUuMy01My44LDU3Yy0xLjEsMC0yLjIsMC0zLjMsMGMtMS4xLDAtMi4yLDAtMy4zLDANCgkJCUMyMTguOCwyMjAuNjUsMTk0LjksMTk1Ljc1LDE5NC45LDE2NS4zNXogTTU5LjMsMTg2LjE1YzAtMjMsMTguNy00MS43LDQxLjctNDEuN3M0MS43LDE4LjcsNDEuNyw0MS43YzAsMjIuNy0xOC4zLDQxLjItNDAuOSw0MS43DQoJCQljLTAuMywwLTAuNSwwLTAuOCwwcy0wLjUsMC0wLjgsMEM3Ny42LDIyNy40NSw1OS4zLDIwOC45NSw1OS4zLDE4Ni4xNXogTTEyNS41LDMyMC4xNUgxNi4yYzQuNS00Mi42LDQwLjUtNzYsODQuMi03Ni4zDQoJCQljMC4yLDAsMC40LDAsMC42LDBzMC40LDAsMC42LDBjMjAuOCwwLjEsMzkuOCw3LjgsNTQuNSwyMC4zQzE0MS43LDI3OS43NSwxMzEsMjk4Ljk1LDEyNS41LDMyMC4xNXogTTM2Ni44LDM1OS45NQ0KCQkJYzAsMjAuNS0xNi43LDM3LjItMzcuMiwzNy4yaC0xNTVjLTIwLjUsMC0zNy4yLTE2LjctMzcuMi0zNy4ydi02LjhjMC02Mi4xLDQ5LjYtMTEyLjksMTExLjMtMTE0LjdjMS4xLDAuMSwyLjMsMC4xLDMuNCwwLjENCgkJCXMyLjMsMCwzLjQtMC4xYzYxLjcsMS44LDExMS4zLDUyLjYsMTExLjMsMTE0LjdWMzU5Ljk1eiBNMzc4LjcsMzIwLjE1Yy01LjUtMjEuMS0xNi00MC0zMC4zLTU1LjZjMTQuOC0xMi44LDM0LTIwLjUsNTUtMjAuNw0KCQkJYzAuMiwwLDAuNCwwLDAuNiwwczAuNCwwLDAuNiwwYzQzLjcsMC4zLDc5LjcsMzMuNyw4NC4yLDc2LjNIMzc4Ljd6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=',
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