import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';
import { selectPage } from '../../../../redux/actions/application';
import { requestOrdersSubmit } from '../../../../redux/actions/orders';
import { orderPrev } from '../../../../redux/actions/order';
import { requestPersonData, CLEAR_PERSON_DATA } from '../../../../redux/actions/person';
import { requestJwtLogout } from '../../../../redux/actions/jwt';
import { JOURNEY_START, JOURNEY_END, ORDER_STATUS_SENDING, ORDER_STATUS_SEND_OK, ORDER_STATUS_NOT_SEND, ORDER_STATUS_SEND_FAILED } from '../../../../helpers/common';
import css from './style.pcss';
import template from './template.html';
import '../../playback-screen-wrapper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
var moment = require('moment');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default class PlaybackScreenEnd extends connect(store)(PolymerElement) {
  static get properties() {
    return {};
  }

  static get template() {
    return html([`<style>${css}</style> ${template}`]);
  }

  constructor() {
    super();
    moment.locale('nl');
  }

  _nextCallback(question) {
    return (next) => {
      if (question && question.next) {
        next(question.next);
      }
    };
  }

  _submit(order) {
    return () =>
      store.dispatch(requestOrdersSubmit({ data: order, requestType: this.journey.request_type_id }));
  }

  dataUrlToSvg(dataURI) {
    return atob(dataURI.replace(/data:image\/svg\+xml;base64,/, ''));
  }

  _createPdf() {
    const documentTitle = this.order_end_title;
    const contentData = [];
    contentData.push({
      width: 150,
      alignment: 'right',
      svg: this.dataUrlToSvg(
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0id2luZG93cy0xMjUyIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjMuMC4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTU1LjMgMTQwLjMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU1NS4zIDE0MC4zOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5BcmNoZWRfeDAwMjBfR3JlZW57ZmlsbDp1cmwoI1NWR0lEXzFfKTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MC4yNTtzdHJva2UtbWl0ZXJsaW1pdDoxO30NCgkuc3Qwe2ZpbGw6IzAwMzk3NjtzdHJva2U6IzAwMzk3NjtzdHJva2Utd2lkdGg6MC4yO30NCgkuc3Qxe2ZpbGw6I0I0OTc1QTt9DQo8L3N0eWxlPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItMjAuMDI5MyIgeTE9IjUyMS45MjgiIHgyPSItMTkuMzIyMiIgeTI9IjUyMS4yMjA5Ij4NCgk8c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMyMEFDNEIiLz4NCgk8c3RvcCBvZmZzZXQ9IjAuOTgzMSIgc3R5bGU9InN0b3AtY29sb3I6IzE5MzYxQSIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGQ9Ik0xODEuNSw3NS44YzEtMC42LDEtMC43LDEuNi0xLjFjMS42LTEuNCwyLjEtMy4yLDIuMi00YzAtMC40LDAtMC45LTAuMS0xLjdjLTAuNiwwLjYtMS4yLDEuMS0yLDEuMWMtMC40LDAtMC44LTAuMS0xLjEtMC40ICBjLTAuOC0wLjUtMS4zLTEuNS0xLjMtMi42YzAtMC4zLDAtMC43LDAuMi0xLjNjMC4zLTAuNiwxLTEuOSwzLTEuOWMwLjMsMCwxLjEsMCwxLjgsMC41YzEuMywwLjgsMS45LDIuNiwxLjksNC4yICBjMCwyLjUtMS4zLDUtMy4xLDYuNWMtMC41LDAuNC0xLjMsMC45LTIuNSwxLjZMMTgxLjUsNzUuOHoiLz4NCjxwYXRoIGQ9Ik0yMDYsNzQuN2gxLjJ2Ni40aC0xLjZjLTAuMi0wLjctMC40LTEuNC0wLjctMi4xYy0xLjItMi43LTMuMy0zLTQuNS0zYy0wLjUsMC0yLDAtMywxLjNjLTAuNCwwLjUtMC41LDEuMS0wLjUsMS43ICBjMCwwLjMsMCwwLjksMC40LDEuNWMwLjksMS41LDMuMSwyLDQuNiwyLjVjMC4yLDAsMS42LDAuNSwyLjYsMWMxLDAuNSwzLjgsMi4yLDMuOCw1LjljMCwwLjctMC4xLDIuMS0xLjEsMy42ICBjLTEsMS41LTIuOCwzLjEtNi44LDMuMWMtMywwLTQuNy0xLTUuOC0xLjZsLTAuNSwxLjJoLTEuNGwwLjItNy44aDEuNmMwLjIsMC45LDAuNSw0LjEsMy4zLDUuNmMwLjksMC41LDEuOCwwLjcsMi44LDAuNyAgYzMsMCwzLjctMi4zLDMuNy0zLjRjMC0wLjQsMC0xLjItMC42LTJjLTAuOS0xLjQtMi42LTEuOC00LjItMi40Yy0xLjMtMC40LTIuNS0wLjgtMy42LTEuNWMtMC45LTAuNi0yLjgtMS45LTIuOC01ICBjMC0wLjUsMC4xLTEuOCwwLjgtM2MxLjgtMy4xLDUuOC0zLjMsNi44LTMuM2MyLDAsMy4yLDAuNSw0LjksMS4zTDIwNiw3NC43eiIvPg0KPHBhdGggZD0iTTIyNy4zLDg1LjRIMjEzdi0zLjNoMTQuNFY4NS40eiIvPg0KPHBhdGggZD0iTTIzNS43LDY3LjljLTAuMi0xLjMtMC40LTEuNS0xLjctMS43aC0yLjR2LTEuOGgxM3YxLjhoLTIuMmMtMS40LDAtMS42LDAuMi0xLjksMS42djEwLjZoMTMuOVY2Ny44ICBjLTAuMi0xLjMtMC40LTEuNC0xLjYtMS42aC0yLjV2LTEuOGgxM3YxLjhoLTIuMWMtMC44LDAtMS4xLDAuMi0xLjQsMC40Yy0wLjUsMC40LTAuNSwwLjgtMC42LDEuNHYyNWMwLDAuMiwwLjEsMC42LDAuNSwwLjkgIGMwLjYsMC41LDEuOCwwLjUsMy42LDAuNXYxLjdoLTEzLjF2LTEuOGgxLjhjMC41LDAsMSwwLDEuNC0wLjFjMC45LTAuMywwLjktMSwxLTEuOVY4MC4zaC0xNHYxMi4zYzAuMywxLjQsMC42LDEuNSwyLjEsMS43aDIuMXYxLjggIGgtMTMuMXYtMS44aDIuNWMxLjItMC4xLDEuNC0wLjMsMS44LTEuNFY2Ny45eiIvPg0KPHBhdGggZD0iTTI3Mi4yLDg0LjNjMCwwLjcsMCwxLjQsMC4xLDIuMWMwLjEsMC45LDAuNCw0LjgsMy4zLDYuOGMxLjUsMSwyLjksMS4xLDMuNiwxLjFjMC41LDAsMS4zLDAsMi40LTAuNSAgYzIuNi0xLjEsMy4zLTMuOSwzLjUtNC42aDEuOWMtMC41LDEuOC0wLjksMi42LTEuNCwzLjRjLTIuNCwzLjktNi41LDQuMS04LDQuMWMtNC4yLDAtNi42LTItNy42LTMuMmMtMi4zLTIuNy0yLjQtNy0yLjQtNy45ICBjMC0wLjksMC4xLTQuMSwxLjctNi44YzAuNC0wLjYsMS0xLjYsMi41LTIuNmMyLjUtMS44LDUuMi0xLjgsNi4zLTEuOGMwLjQsMCwxLjgsMCwzLjEsMC41YzIuMywwLjgsNCwyLjcsNC43LDQuOSAgYzAuNCwxLjMsMC41LDMuMSwwLjYsNC42SDI3Mi4yeiBNMjgyLjMsODIuNmMwLTEuOC0wLjEtMy42LTEuMS01LjJjLTAuMS0wLjItMC40LTAuNi0wLjktMWMtMC40LTAuMy0xLjItMC43LTIuNC0wLjcgIGMtMS4zLDAtMi4yLDAuNS0yLjcsMC44Yy0xLjcsMS0yLjMsMi41LTMuMSw2LjFIMjgyLjN6Ii8+DQo8cGF0aCBkPSJNMzAzLjQsOTQuNHYxLjdoLTEyLjJ2LTEuN2gxLjljMS4zLTAuMiwxLjQtMC41LDEuNi0xLjdWNzguNWMtMC4xLTEuMi0wLjItMS4zLTEuMy0xLjZoLTIuMXYtMS43YzEuMywwLDIuNywwLDQtMC4xICBjMS4xLTAuMSwyLjMtMC4yLDMuNC0wLjR2NC4yYzAuOS0xLjcsMS44LTMuMiwzLjYtNGMwLjMtMC4xLDEtMC41LDEuOS0wLjVjMC4zLDAsMS4xLDAsMS44LDAuNWMwLjgsMC40LDEuNiwxLjIsMS42LDMuMSAgYzAsMi4zLTEuNSwzLTIuNCwzYy0xLDAtMi4yLTAuOC0yLjItMmMwLTAuNiwwLjUtMS4yLDAuNS0xLjZjMC0wLjQtMC42LTAuNi0xLjEtMC42Yy0wLjQsMC0wLjcsMC4xLTEuMSwwLjRjLTAuNiwwLjQtMS41LDEuMy0yLDIuOSAgYy0wLjcsMi0wLjYsNC4yLTAuNiw4LjZjMCwxLjIsMCwyLjQsMCwzLjZjMCwwLjgsMCwxLjUsMC41LDJjMC41LDAuNCwxLDAuNCwxLjYsMC4zSDMwMy40eiIvPg0KPHBhdGggZD0iTTMxNC4zLDY4LjdsNC0ydjguNGg0Ljd2MS44aC00Ljd2MTEuOGMwLDIuMywwLjEsNS42LDMuMSw1LjZjMSwwLDEuOC0wLjUsMi43LTFsMCwxLjZsLTEuMiwwLjdjLTAuNywwLjQtMS45LDAuOS0zLjgsMC45ICBjLTIuOCwwLTQuMS0xLjYtNC41LTIuNmMtMC4zLTAuOC0wLjQtMS44LTAuNC0yLjdWNzYuOGgtMy4zdi0xLjhoMy40TDMxNC4zLDY4Ljd6Ii8+DQo8cGF0aCBkPSJNMzI4LjksODAuMWMyLjQtNS4xLDcuNy01LjgsOS41LTUuOGMxLjIsMCw0LjcsMC4yLDcuMSwyLjljMSwxLjIsMi45LDMuOSwyLjksOC4xYzAsMS45LTAuNSw3LjMtNS42LDEwICBjLTAuOCwwLjQtMi42LDEuMi01LDEuMmMtMi43LDAtNS41LTEuMS03LjQtM2MtMS4xLTEuMi0yLjktNC0yLjgtOC4zQzMyNy43LDg0LjUsMzI3LjgsODIuMywzMjguOSw4MC4xeiBNMzM0LDkzLjMgIGMwLjQsMC42LDEuNywxLjgsMy45LDEuOGMxLjgsMCwzLjItMC45LDQuMi0yLjNjMS44LTIuNywxLjYtNi40LDEuNi03LjFjMC0wLjQsMC4yLTUuNC0xLjctOGMtMS4zLTEuNy0zLjItMS45LTMuOS0xLjkgIGMtMC42LDAtMiwwLjEtMy4yLDEuMmMtMi4zLDItMi43LDUuOS0yLjcsOC44QzMzMi4yLDg1LjksMzMyLjIsOTAuOSwzMzQsOTMuM3oiLz4NCjxwYXRoIGQ9Ik0zNTQuMyw5My42YzAtMS44LDEuMS0zLjMsMy41LTZjLTAuNi0wLjUtMS0wLjktMS4zLTEuMWMtMS42LTEuNi0xLjctMy45LTEuNy00LjZjMC0wLjUsMC4xLTEuOCwwLjgtMy4yICBjMC45LTEuNiwzLjItNC4zLDcuNy00LjNjMC41LDAsMSwwLDEuNSwwLjFjMS45LDAuMiwyLjcsMC42LDQuMywxLjhjMS0wLjksMi4xLTEuNywzLjYtMS43YzEuMSwwLDIuMSwwLjUsMi4xLDEuOCAgYzAsMC4yLDAsMS4xLTAuOCwxLjFjLTAuNCwwLTAuOC0wLjItMS4xLTAuM2MtMC41LTAuMi0wLjgtMC4yLTEuMS0wLjJjLTAuNywwLTEuNSwwLjItMS43LDAuMmMwLjcsMC44LDEuNywxLjksMS43LDQuMyAgYzAsMS4xLTAuMywzLjctMi43LDUuNmMtMi4zLDEuOC01LDEuOC01LjksMS44Yy0yLjEsMC0zLjEtMC41LTQtMC44Yy0wLjksMC45LTEuOSwxLjktMS45LDMuMmMwLDAuMywwLDAuNiwwLjIsMC45ICBjMC40LDAuNiwxLjUsMS4xLDMuMywxLjFjMC45LDAsMS44LTAuMSwyLjYtMC4xYzEtMC4xLDEuOS0wLjEsMi45LTAuMmMwLjYsMCwxLjMsMCwyLDBjMC4zLDAsMS44LDAsMywwLjRjMS4yLDAuNCw0LDEuNiw0LDUuMyAgYzAsMS41LTAuNCw0LjQtMy41LDYuOGMtMy40LDIuNy03LjMsMi43LTguOCwyLjdjLTMuMiwwLTUtMC41LTYuMy0xLjJjLTAuOC0wLjQtNC0yLTQtNS40YzAtMC40LDAtMSwwLjQtMS44ICBjMC42LTEuNSwxLjgtMi40LDMuMS0zLjRDMzU1LDk1LjcsMzU0LjMsOTUuMSwzNTQuMyw5My42eiBNMzU2LjUsMTAxYzAsMSwwLjMsMS45LDAuOSwyLjdjMC45LDEuMiwyLjksMi44LDYuNSwyLjggIGMxLjQsMCwyLjQtMC4yLDIuOS0wLjRjMi41LTAuNyw1LjItMi41LDUuMi01LjNjMC0xLjgtMS4yLTIuNy0xLjgtMy4xYy0xLjYtMC45LTUuNi0wLjctNy41LTAuOGMtMS41LDAtMy0wLjEtNC41LTAuMiAgQzM1Ny4yLDk4LjIsMzU2LjUsOTkuNCwzNTYuNSwxMDF6IE0zNTkuNSw4NC40YzAuNiwxLjgsMi4yLDMuMiw0LjEsMy4yYzAuNCwwLDEuMiwwLDItMC42YzAuOS0wLjcsMi4xLTIuMywyLjEtNSAgYzAtNC4zLTIuMi02LjEtNC4yLTYuMWMtMC40LDAtMSwwLTEuOCwwLjVjLTEuMSwwLjYtMi4zLDIuMS0yLjUsNC45QzM1OSw4Mi44LDM1OS4zLDgzLjksMzU5LjUsODQuNHoiLz4NCjxwYXRoIGQ9Ik0zODQsODQuM2MwLDAuNywwLDEuNCwwLjEsMi4xYzAuMSwwLjksMC40LDQuOCwzLjMsNi44YzEuNSwxLDIuOSwxLjEsMy42LDEuMWMwLjQsMCwxLjMsMCwyLjQtMC41YzIuNi0xLjEsMy4zLTMuOSwzLjUtNC42ICBoMS45Yy0wLjUsMS44LTAuOSwyLjYtMS40LDMuNGMtMi40LDMuOS02LjUsNC4xLTgsNC4xYy00LjIsMC02LjYtMi03LjYtMy4yYy0yLjMtMi43LTIuNC03LTIuNC03LjljMC0wLjksMC4xLTQuMSwxLjctNi44ICBjMC40LTAuNiwxLTEuNiwyLjUtMi42YzIuNS0xLjgsNS4yLTEuOCw2LjMtMS44YzAuNCwwLDEuOCwwLDMuMSwwLjVjMi4zLDAuOCw0LDIuNyw0LjcsNC45YzAuNSwxLjMsMC41LDMuMSwwLjYsNC42SDM4NHogICBNMzk0LjEsODIuNmMwLTEuOC0wLjEtMy42LTEuMS01LjJjLTAuMS0wLjItMC40LTAuNi0wLjktMWMtMC40LTAuMy0xLjItMC43LTIuNC0wLjdjLTEuNCwwLTIuMiwwLjUtMi43LDAuOCAgYy0xLjcsMS0yLjMsMi41LTMuMSw2LjFIMzk0LjF6Ii8+DQo8cGF0aCBkPSJNNDAzLjMsNzUuMmMxLjYsMCwzLjEsMCw0LjYtMC4yYzAuOS0wLjEsMS44LTAuMiwyLjctMC4zbDAsMy40YzAuOC0wLjksMS42LTEuOCwyLjYtMi40YzEuOC0xLjIsMy43LTEuMyw0LjUtMS4zICBjMi40LDAsNC43LDEsNS43LDMuMmMwLjYsMS4zLDAuNiwyLjYsMC42LDIuOWMwLjEsMS42LDAuMSwzLjEsMC4xLDQuN2MwLDIuMywwLDQuNywwLDcuMWMwLDAtMC4xLDEuNiwwLjcsMiAgYzAuNCwwLjIsMS4zLDAuMiwyLjUsMC4xdjEuN0g0MTd2LTEuN2MyLjIsMCwyLjgsMC4yLDIuOS0yLjNWODIuMWMwLTEuMi0wLjEtMi42LTAuNi0zLjZjLTAuNy0xLjMtMS42LTEuNy0zLTEuN2MtMiwwLTQuMiwxLjItNSwzICBjLTAuNCwwLjctMC40LDEuMi0wLjUsMnYxMC42YzAsMC43LDAuMSwxLjQsMC41LDEuN2MwLjQsMC40LDEuMywwLjUsMi42LDAuNHYxLjdoLTEwLjZsMC0xLjdoMS42YzAuNiwwLDAuOCwwLDEtMC4xICBjMC45LTAuNCwwLjgtMiwwLjgtMi4xVjc5YzAtMS44LTAuNi0yLjEtMS42LTIuMWgtMS44Vjc1LjJ6Ii8+DQo8cGF0aCBkPSJNNDM0LDk2LjJWNjYuMWMwLTAuNSwwLTAuOS0wLjQtMS4zYy0wLjQtMC40LTEuMS0wLjQtMi4zLTAuNHYtMS43YzEuMywwLDIuNi0wLjEsMy45LTAuMmMxLDAsMi4xLTAuMiwzLjEtMC4zdjUuNWwwLDEwLjMgIGMwLjQtMC40LDAuNy0wLjksMS4xLTEuM2MxLTEuMSwyLjYtMi40LDYtMi40YzAuNCwwLDIuMSwwLDMuNSwwLjdjMi4yLDEsNC43LDQuMSw0LjcsOS44YzAsMC44LTAuMSw0LjUtMS42LDcuMiAgYy0wLjMsMC41LTEsMS43LTIuNCwyLjhjLTIuMSwxLjctNC40LDEuOS01LjQsMS45Yy0wLjgsMC0yLjctMC4xLTQuNy0xLjNjLTAuNy0wLjUtMS0wLjgtMS43LTEuM2MtMS4xLDAuOS0xLjQsMS4yLTIuNCwyLjFINDM0eiAgIE00MzguMiw4OC45YzAuMSwxLjksMC43LDMuOCwyLjMsNC45YzAuNSwwLjQsMS41LDEsMy4xLDFjMC42LDAsMi4yLTAuMSwzLjQtMS40YzEuMy0xLjUsMi4zLTQuNSwyLjMtOS4xYzAtMC40LDAtNC4xLTEuNC02LjMgIGMtMC4zLTAuNC0wLjctMC45LTEuNy0xLjNjLTAuNC0wLjItMS0wLjUtMi0wLjVjLTEuMiwwLTIuNCwwLjUtMy4zLDEuM2MtMi43LDIuMy0yLjcsNi42LTIuNyw5LjhWODguOXoiLz4NCjxwYXRoIGQ9Ik00NjAuNCw4MC4xYzIuNC01LjEsNy42LTUuOCw5LjUtNS44YzEuMiwwLDQuNywwLjIsNy4xLDIuOWMxLDEuMiwyLjksMy45LDIuOSw4LjFjMCwxLjktMC41LDcuMy01LjYsMTAgIGMtMC44LDAuNC0yLjYsMS4yLTUsMS4yYy0yLjcsMC01LjUtMS4xLTcuNC0zYy0xLjEtMS4yLTIuOS00LTIuOC04LjNDNDU5LjIsODQuNSw0NTkuMyw4Mi4zLDQ2MC40LDgwLjF6IE00NjUuNSw5My4zICBjMC41LDAuNiwxLjcsMS44LDMuOSwxLjhjMS44LDAsMy4yLTAuOSw0LjItMi4zYzEuOC0yLjcsMS42LTYuNCwxLjYtNy4xYzAtMC40LDAuMi01LjQtMS43LThjLTEuMy0xLjctMy4yLTEuOS0zLjktMS45ICBjLTAuNiwwLTIsMC4xLTMuMiwxLjJjLTIuMywyLTIuNyw1LjktMi43LDguOEM0NjMuNyw4NS45LDQ2My43LDkwLjksNDY1LjUsOTMuM3oiLz4NCjxwYXRoIGQ9Ik00OTkuMSw3NC43aDEuMnY2LjRoLTEuNmMtMC4yLTAuNy0wLjQtMS40LTAuNy0yLjFjLTEuMi0yLjctMy4zLTMtNC41LTNjLTAuNSwwLTIsMC0zLDEuM2MtMC40LDAuNS0wLjUsMS4xLTAuNSwxLjcgIGMwLDAuMywwLDAuOSwwLjQsMS41YzAuOSwxLjUsMy4xLDIsNC42LDIuNWMwLjIsMCwxLjYsMC41LDIuNiwxYzEsMC41LDMuOCwyLjIsMy44LDUuOWMwLDAuNy0wLjEsMi4xLTEuMSwzLjYgIGMtMSwxLjUtMi44LDMuMS02LjgsMy4xYy0zLDAtNC43LTEtNS44LTEuNmwtMC41LDEuMmgtMS40bDAuMi03LjhoMS42YzAuMiwwLjksMC41LDQuMSwzLjMsNS42YzAuOSwwLjUsMS44LDAuNywyLjgsMC43ICBjMywwLDMuNy0yLjMsMy43LTMuNGMwLTAuNCwwLTEuMi0wLjYtMmMtMC45LTEuNC0yLjYtMS44LTQuMi0yLjRjLTEuMy0wLjQtMi41LTAuOC0zLjYtMS41Yy0wLjktMC42LTIuOC0xLjktMi44LTUgIGMwLTAuNSwwLjEtMS44LDAuOC0zYzEuOC0zLjEsNS44LTMuMyw2LjgtMy4zYzIsMCwzLjIsMC41LDUsMS4zTDQ5OS4xLDc0Ljd6Ii8+DQo8cGF0aCBkPSJNNTI2LDg5LjFjLTAuNiwyLjItMSwzLjItMS42LDRjLTEuNCwyLjMtNC4yLDMuNS03LDMuNWMtMSwwLTQuNi0wLjItNy4xLTIuNWMtMi45LTIuNy0zLjEtNi44LTMuMS04YzAtMC41LDAtMS40LDAuMi0yLjYgIGMwLjUtMi40LDEuNS00LjgsMy4yLTYuNGMxLTEsMy41LTIuNyw3LjQtMi43YzMuNSwwLDUuNiwxLjQsNi41LDIuNmMwLjgsMSwwLjksMi4xLDAuOSwyLjZjMCwxLjItMC40LDIuMi0xLjQsMi43ICBjLTAuMiwwLjEtMC42LDAuMy0xLjIsMC4zYy0wLjIsMC0wLjgsMC0xLjMtMC40Yy0wLjktMC43LTAuOS0xLjktMS0yLjNjMC43LTAuOSwwLjktMS4zLDAuOS0xLjhjMC0xLTAuNy0yLjMtMy0yLjIgIGMtMSwwLTIuOSwwLjItNC41LDIuMmMtMS4xLDEuNS0xLjksMy42LTEuOSw3LjZjMCwxLjIsMC4xLDIuNSwwLjIsMi44YzAuMywyLjIsMC45LDMuOSwyLjcsNS4yYzAuNSwwLjMsMS44LDEuMSwzLjUsMS4xICBjMS4xLDAsMy4zLTAuMyw0LjgtMi43YzAuNS0wLjksMC44LTEuOSwxLjEtMi44SDUyNnoiLz4NCjxwYXRoIGQ9Ik01NTAsOTEuOGMwLDIuNywwLjcsMi43LDMuMywyLjd2MS43aC0xMC40di0xLjdjMi40LDAsMi45LTAuMSwyLjktMi43VjgwLjVjMC0wLjMtMC4xLTAuNi0wLjItMC45ICBjLTAuMi0wLjUtMC41LTEuNy0xLjgtMi40Yy0wLjMtMC4xLTEtMC41LTItMC41Yy0yLjUsMC00LjIsMi4zLTQuNSwyLjhjLTAuNCwwLjctMC41LDEuMi0wLjYsMS45bC0wLjEsMy4ydjguMSAgYzAuMiwwLjcsMC4zLDEuMiwwLjksMS40YzAuNCwwLjIsMS4xLDAuMiwyLjIsMC4ydjEuOEg1Mjl2LTEuN2gxLjVjMS41LTAuMywxLjctMC41LDEuOC0yLjFWNjYuOGMwLTAuNS0wLjEtMS4yLTAuMy0xLjUgIGMtMC40LTAuNy0xLjMtMC43LTMtMC42di0xLjdjMy4yLTAuMSw0LjQtMC4yLDcuNS0wLjdWNzhjMC4yLTAuMiwwLjgtMSwxLjUtMS43YzAuNy0wLjYsMi42LTIuMSw1LjUtMi4xYzMuMiwwLDQuOSwxLjksNS42LDIuOSAgYzEuMSwxLjcsMSwzLjYsMSw1LjZWOTEuOHoiLz4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04NS4xLDEzOC4xYzAsMC05LjksMC0xNi45LTEuNWMtNi45LTEuNS0xMy45LTMuOC0yMC4zLTcuOGMtNi40LTQtOC44LTguOS04LjgtMTAuMWMwLDAsMy45LTMuNCw1LjItNC40ICBjMi4zLTEuOCw2LjQtMy45LDYuNC0zLjlzMi40LDMuMyw3LjMsNS4zYzQuOSwxLjksOS4xLDMuNCwxNi42LDQuM2M3LjUsMC45LDEwLjUsMC43LDEwLjUsMC43SDg1YzAsMCwzLjEsMC4yLDEwLjUtMC43ICBjNy41LTAuOSwxMS43LTIuNCwxNi42LTQuM2M0LjktMS45LDcuMy01LjMsNy4zLTUuM3M0LjEsMi4xLDYuNCwzLjljMS4zLDEsNS4yLDQuNCw1LjIsNC40YzAsMS4yLTIuNSw2LjEtOC44LDEwLjEgIGMtNi40LDQtMTMuNCw2LjMtMjAuMyw3LjhDOTUsMTM4LjEsODUuMSwxMzguMSw4NS4xLDEzOC4xeiIvPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTTg1LjMsMTAxYzAsMC04LjcsMC0xNCwwLjljLTEuNywwLjMtOS4xLDEuMy0xNS40LDMuNWMtNi4zLDIuMy0xMC45LDUuNi0xMi4zLDYuN2MtMS41LDEuMS00LjMsMy40LTQuMywzLjQgIGMwLjgtNi4yLDExLjQtMTAuOCwxMy4xLTExLjVjMS43LTAuNywxMy42LTYuMSwzMy02LjFIODVjMTkuNSwwLDMxLjMsNS41LDMzLDYuMWMxLjcsMC43LDEyLjMsNS4zLDEzLjEsMTEuNWMwLDAtMi45LTIuMy00LjMtMy40ICBjLTEuNS0xLjEtNi4xLTQuNC0xMi4zLTYuN2MtNi4zLTIuMy0xMy44LTMuMy0xNS40LTMuNWMtNS40LTAuOS0xNC0wLjktMTQtMC45SDg1LjN6Ii8+DQo8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9Ijg1LDI4LjkgNzguMiwxNi42IDg0LjksNC4yIDg0LjksNC4yIDkxLjcsMTYuNiA4NS4xLDI4LjkgIi8+DQo8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjQ2LjIsMzQuNiAzNi40LDI0LjUgMzkuNiwxMC44IDM5LjYsMTAuOCA0OS40LDIwLjkgNDYuMywzNC42ICIvPg0KPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMjMuOSwzNC42IDEzMy43LDI0LjUgMTMwLjYsMTAuOCAxMzAuNiwxMC44IDEyMC44LDIwLjkgMTIzLjgsMzQuNiAiLz4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04NC45LDgxYy0xLjcsMC0zLjYsMC4yLTUuNiwwLjVjMS4zLTEsNC4yLTMuMyw0LjItMy4zbC0xLjItMTAuMWMwLDAtMy0wLjEtNS0wLjJjLTEuOS0wLjEtMy40LTEuMS00LjUtMy40ICBjLTEuMS0yLjMtMC43LTUuMywwLjgtNy4yYzEuNS0xLjksMy4xLTEuOSwzLjEtMS45cy0wLjktMC41LTEuNS0yYy0wLjctMi0wLjUtMy45LDEuMy01LjljMS44LTEuOSw0LjctMC42LDQuNy0wLjYgIGMtMC4xLTAuNS0wLjUtMy4zLDAuOC01LjFjMC42LTAuOCwxLjktMS42LDIuNy0xLjZsMC4yLDBjMC44LDAsMi4xLDAuOCwyLjcsMS42YzEuNCwxLjgsMSw0LjYsMC44LDUuMWMwLDAsMy0xLjQsNC43LDAuNiAgYzEuOCwxLjksMiwzLjgsMS4zLDUuOWMtMC41LDEuNS0xLjUsMi0xLjUsMnMxLjYsMCwzLjEsMS45YzEuNSwxLjksMS45LDQuOSwwLjgsNy4yYy0xLjEsMi4zLTIuNiwzLjMtNC41LDMuNGMtMS45LDAuMS01LDAuMi01LDAuMiAgbC0xLjIsMTAuMWMwLDAsMi45LDIuMyw0LjIsMy4zYy0yLTAuMy0zLjgtMC41LTUuNi0wLjVMODQuOSw4MXogTTg1LjEsNjcuOGwyLjYsMGw1LjUtNi43bC04LDQuMUg4NWwtOC00LjFsNS41LDYuN0w4NS4xLDY3LjggIEw4NS4xLDY3Ljh6Ii8+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUwLjgsNjIuN2MwLDAtNS45LDExLjktOC42LDE4LjljMCwwLTIuOC00LTUuMi01LjVjMCwwLDMsNi4yLDIuOCw3LjhsMS4zLDAuN2MwLDAtMi4zLDUuNy00LjEsMTEuOSAgYzAsMC0wLjUtMS41LTQuNC0zLjJsNC43LTAuN2wyLjQtOC42YzAsMC0zLjYtMi40LTQuNC0zYy0wLjctMC41LTIuNC0xLjYtMi43LTQuMmMtMC4zLTIuNiwwLjUtNC40LDIuMi01LjIgIGMxLjYtMC44LDMuNC0wLjMsNC4xLDAuMWMwLDAtMC44LTEuNi0wLjUtMy41YzAuNC0xLjksMS41LTIuNSwyLjItMi45YzAuNy0wLjMsMi0wLjcsMy42LDBjMSwwLjQsMS40LDEuMiwxLjQsMS4yczAuNC0wLjUsMC41LTAuOCAgYzAuMS0wLjcsMS4xLTIuMSwyLTIuNkMxNDkuMiw2Mi43LDE1MCw2Mi41LDE1MC44LDYyLjd6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTY5LjIsMzEuNWMwLDAtOC4yLDExLjMtMTIuNiwxOS4zbDAuOC0xMi42TDE2OS4yLDMxLjV6Ii8+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTkuMyw2Mi43YzAsMCw1LjksMTEuOSw4LjYsMTguOWMwLDAsMi44LTQsNS4yLTUuNWMwLDAtMyw2LjItMi44LDcuOEwyOSw4NC42YzAsMCwyLjMsNS43LDQuMSwxMS45ICBjMCwwLDAuNS0xLjUsNC40LTMuMmwtNC43LTAuN2wtMi40LTguNmMwLDAsMy42LTIuNCw0LjQtM2MwLjctMC41LDIuNC0xLjYsMi43LTQuMmMwLjMtMi42LTAuNS00LjQtMi4yLTUuMiAgYy0xLjYtMC44LTMuNC0wLjMtNC4xLDAuMWMwLDAsMC44LTEuNiwwLjUtMy41Yy0wLjQtMS45LTEuNS0yLjUtMi4yLTIuOWMtMC43LTAuMy0yLTAuNy0zLjYsMGMtMSwwLjQtMS40LDEuMi0xLjQsMS4yICBzLTAuNC0wLjUtMC41LTAuOGMtMC4xLTAuNy0xLjEtMi4xLTItMi42QzIxLDYyLjcsMjAuMiw2Mi41LDE5LjMsNjIuN3oiLz4NCjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yLjIsMzIuMmMwLDAsOC4yLDExLjMsMTIuNiwxOS4zTDE0LDM5TDIuMiwzMi4yeiIvPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTTU4LjQsODMuNmMtMS43LDAuNC0zLjUsMS4xLTUuMywxLjljMS0xLjMsMy4yLTQuMywzLjItNC4zbC0zLjctOS40YzAsMC0zLDAuNy00LjgsMS4xICBjLTEuOSwwLjQtMy42LTAuMi01LjItMi4xYy0xLjctMi0yLTQuOS0xLjEtNy4yYzEtMi4zLDIuNS0yLjYsMi41LTIuNnMtMS0wLjItMS45LTEuNWMtMS4yLTEuOC0xLjUtMy43LTAuMy02ICBjMS4yLTIuMyw0LjQtMS44LDQuNC0xLjhjLTAuMy0wLjUtMS4zLTMtMC41LTUuMWMwLjQtMC45LDEuNC0yLDIuMi0yLjNsMC4yLDBjMC44LTAuMiwyLjMsMC4zLDMsMC45YzEuOCwxLjQsMi4xLDQuMSwyLjEsNC43ICBjMCwwLDIuNS0yLjEsNC43LTAuN2MyLjIsMS40LDIuOSwzLjIsMi44LDUuM2MtMC4xLDEuNi0wLjksMi4zLTAuOSwyLjNzMS41LTAuNCwzLjUsMWMyLDEuNSwzLjEsNC4yLDIuNyw2LjggIGMtMC40LDIuNS0xLjYsMy45LTMuNSw0LjVjLTEuOCwwLjYtNC43LDEuNS00LjcsMS41bDEuNSwxMGMwLDAsMy40LDEuNSw0LjksMi4xYy0yLDAuMi0zLjgsMC41LTUuNSwxTDU4LjQsODMuNnogTTU1LDcwLjlsMi41LTAuNyAgbDMuNi03LjlsLTYuNyw2LjFsLTAuMSwwbC04LjgtMS45bDcuMSw1TDU1LDcwLjlMNTUsNzAuOXoiLz4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMTEuNyw4My42Yy0xLjctMC41LTMuNS0wLjgtNS41LTFjMS41LTAuNiw0LjktMi4xLDQuOS0yLjFsMS41LTEwYzAsMC0yLjktMC45LTQuNy0xLjUgIGMtMS44LTAuNi0zLTEuOS0zLjUtNC41Yy0wLjQtMi41LDAuNy01LjMsMi43LTYuOGMyLTEuNSwzLjUtMSwzLjUtMXMtMC44LTAuNy0wLjktMi4zYy0wLjItMi4yLDAuNS0zLjksMi44LTUuMyAgYzIuMi0xLjQsNC43LDAuNyw0LjcsMC43YzAtMC41LDAuNC0zLjMsMi4xLTQuN2MwLjgtMC42LDIuMi0xLjEsMy0wLjlsMC4yLDBjMC44LDAuMiwxLjgsMS40LDIuMiwyLjNjMC44LDIuMS0wLjIsNC43LTAuNSw1LjEgIGMwLDAsMy4yLTAuNiw0LjQsMS44YzEuMiwyLjMsMC45LDQuMi0wLjMsNmMtMC45LDEuMy0xLjksMS41LTEuOSwxLjVzMS41LDAuNCwyLjUsMi42YzEsMi4zLDAuNiw1LjItMS4xLDcuMiAgYy0xLjcsMi0zLjQsMi41LTUuMiwyLjFjLTEuOS0wLjQtNC44LTEuMS00LjgtMS4xbC0zLjcsOS40YzAsMCwyLjIsMywzLjIsNC4zYy0xLjgtMC44LTMuNi0xLjUtNS4zLTEuOUwxMTEuNyw4My42eiBNMTE1LjMsNzAuOSAgbDIuNSwwLjZsNy4xLTVsLTguOCwxLjlsLTAuMSwwbC02LjctNi4xbDMuNiw3LjlMMTE1LjMsNzAuOUwxMTUuMyw3MC45eiIvPg0KPC9zdmc+')
    });
    contentData.push({ text: this.order_end_title, style: 'header' });
    contentData.push({ text: `De volgende gegevens zijn op ${moment(this.orderDate).format('D MMMM YYYY HH:mm:ss')} verzonden naar de gemeente.` });
    contentData.push(this.questionsToPdf());

    const today = new Date();

    const docDefinition = {
      content: contentData,
      info: {
        title: documentTitle,
      },
      background: function (currentPage, pageSize) {
        return {};
      },
      footer: function (currentPage, pageCount) {
        return {
          table: {
            widths: ['*', 100],
            body: [
              [
                { text: `Document gegenereerd op ${moment(today).format('D MMMM YYYY')}` },
                { text: `pagina ${currentPage} van ${pageCount}`, alignment: 'right' },
              ]
            ]
          },
          layout: 'noBorders',
          margin: [30, 0, 30, 0],
        }
      },
      styles: {
        header: {
          margin: [0, 0, 0, 10],
          fontSize: 20,
          bold: true,
        },
        question: {
          margin: [0, 0, 0, 10],
          fontSize: 11,
          bold: true,
        },
        answer: {
          margin: [10, 0, 0, 15],
          fontSize: 11,
        }
      }
    };

    pdfMake.createPdf(docDefinition).download(documentTitle);
  }

  formatAddress(address) {
    if (address) {
      var formattedAddress = `${address.straatnaam} ${address.huisnummer}${address.huisnummertoevoeging ? ' ' + address.huisnummertoevoeging : ''}${address.huisletter ? address.huisletter : ''}, ${address.postcode} ${address.woonplaatsnaam}`;
      return formattedAddress;
    }
    return '';
  }

  questionsToPdf() {
    var body = [
      [{ width: 15, height: 15, svg: this.dataUrlToSvg('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgaWQ9Im1pam5BcHBfdXNlciIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0ODAgNDgwIiANCgkJc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgwIDQ4MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmNWY1ZjU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuOTczNTQzMTc7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5OjIuOTczNTQzMzEsIDguOTIwNjI5OTE5OTk5OTk3ODg7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm5vcm1hbCIgDQoJCQlpZD0icGF0aDQ1MDgiIGN4PSIyNDAiIGN5PSIyNDAiIHI9IjI0MCIvPg0KCTxwYXRoIGQ9Ik0gMjM5Ljk5MzUsNDggQyAxMzMuOTU2LDQ4IDQ3Ljk5MzUwMywxMzMuOTYyNSA0Ny45OTM1MDMsMjQwIGMgMCwxMDYuMDM3NSA4NS45NjI0OTcsMTkyIDE5MS45OTk5OTcsMTkyIDUuNzg0MzgsMCAxMS41NDY4OCwtMC4yNTkzOCAxNy4yODEyNSwtMC43NzUgNS4zMzEyNSwtMC40NzgxMiAxMC42MTU2MywtMS4yMDkzOCAxNS44NTkzOCwtMi4xMjUgbCAyLjAxNTYyLC0wLjM1NjI1IEMgMzcyLjY0MDM4LDQxMC41NSA0NDAuMjM3MjUsMzIxLjEwMzEyIDQzMS4xMTg1LDIyMi4zNDY4OCA0MjEuOTk5NzUsMTIzLjU5MDYyIDMzOS4xNjg1LDQ4LjAzMTI1IDIzOS45OTM1LDQ4IFogbSAtMTUuNDI1LDM3MC41MjE4OCBoIC0wLjQ1MzEyIGMgLTQuOTc4MTMsLTAuNDQwNjMgLTkuOTE4NzUsLTEuMTA2MjYgLTE0LjgxNTYzLC0xLjk1OTM4IC0wLjI4MTI1LC0wLjA1IC0wLjU2MjUsLTAuMDgxMyAtMC44Mzc1LC0wLjEzNDM4IC00Ljc4NzUsLTAuODU2MjQgLTkuNTI1LC0xLjkxODc0IC0xNC4yMTU2MiwtMy4xNTkzNyBsIC0xLjEzNDM4LC0wLjI5MDYzIGMgLTQuNTc1LC0xLjI0MDYyIC05LjEsLTIuNjgxMjQgLTEzLjU1OTM3LC00LjI4MTI0IC0wLjQ2MjUsLTAuMTY1NjMgLTAuOTI4MTMsLTAuMzEyNSAtMS4zOTA2MywtMC40ODQzOCAtNC4zNzE4NywtMS42MDYyNSAtOC42NjU2MiwtMy40MDYyNSAtMTIuODkzNzUsLTUuMzUzMTIgLTAuNTI1LC0wLjIzNDM4IC0xLjA1LC0wLjQ1OTM4IC0xLjU3NSwtMC43MDkzOCAtNC4xNDY4NywtMS45MTg3NSAtOC4yMTI1LC00LjA4MTI1IC0xMi4yLC02LjM1NjI1IC0wLjU2MjUsLTAuMzE4NzUgLTEuMTMxMjUsLTAuNjM3NSAtMS42OTM3NSwtMC45NTMxMyAtMy45MjUsLTIuMjkwNjIgLTcuNzU5MzcsLTQuNzQ2ODcgLTExLjUyMTg3LC03LjM0MDYyIC0wLjU2ODc1LC0wLjM5Njg4IC0xLjE0Mzc1LC0wLjc4MTI1IC0xLjcwOTM4LC0xLjE3ODEyIC0zLjY5Njg3LC0yLjYyMTg4IC03LjMsLTUuNDA2MjYgLTEwLjgwOTM3LC04LjMxODc2IGwgLTAuOTY1NjMsLTAuODQzNzQgViAzMjMuMiBjIDAuMDQ2OSwtMzguODYyNSAzMS41Mzc1LC03MC4zNTMxMiA3MC40LC03MC40IGggODkuNiBjIDM4Ljg2MjUsMC4wNDY5IDcwLjM1MzEzLDMxLjUzNzUgNzAuNCw3MC40IHYgNTMuOTY1NjIgbCAtMC44NSwwLjcwOTM4IGMgLTMuNTc4MTIsMi45ODc1IC03LjI1LDUuODEyNSAtMTEuMDIxODcsOC40ODEyNSAtMC41LDAuMzUgLTEuMDA2MjUsMC42ODQzNyAtMS41MDMxMywxLjAyODEzIC0zLjgwNjI1LDIuNjQzNzQgLTcuNzA2MjUsNS4xMzEyNCAtMTEuNyw3LjQ2ODc0IC0wLjUsMC4yOTA2MyAtMS4wMTI1LDAuNTY1NjMgLTEuNTA5MzcsMC44NTMxMyAtNC4wNDY4OCwyLjMwMzEzIC04LjE2MjUsNC40NzgxMyAtMTIuMzU5MzgsNi40Mzc1IC0wLjQ4MTI1LDAuMjI1IC0wLjk2NTYyLDAuNDM0MzcgLTEuNDUzMTIsMC42NDA2MyAtNC4yNjI1LDEuOTY1NjIgLTguNTkzNzUsMy43NzUgLTEyLjk5Njg4LDUuMzkzNzQgLTAuNDM3NSwwLjE2MjUgLTAuODc4MTIsMC4zMDMxMyAtMS4yODEyNSwwLjQ1NjI2IC00LjQ4MTI1LDEuNjA2MjQgLTkuMDI1LDMuMDU5MzcgLTEzLjYyNSw0LjMwNjI0IGwgLTEuMTAzMTIsMC4yNzUgYyAtNC42OTY4OCwxLjI0MDYzIC05LjQzNzUsMi4zMDkzOCAtMTQuMjMxMjUsMy4xNjg3NiAtMC4yNzUsMC4wNSAtMC41NSwwLjA4NDQgLTAuODI1LDAuMTI4MTIgLTQuOTAzMTMsMC44NTYyNSAtOS44NSwxLjUyMTg4IC0xNC44MzEyNSwxLjk2NTYyIGggLTAuNDUzMTMgYyAtNS4xMTg3NSwwLjQ0MDYzIC0xMC4yNDA2MiwwLjY3ODEzIC0xNS40MjUsMC42NzgxMyAtNS4xODQzNywwIC0xMC4zNDY4NywtMC4xOTM3NSAtMTUuNDU2MjUsLTAuNjM0MzcgeiBNIDM2Ny45OTM1LDM2NS4zIHYgLTQyLjEgYyAtMC4wNTMxLC00NS45MjgxMiAtMzcuMjcxODcsLTgzLjE0Njg4IC04My4yLC04My4yIGggLTg5LjYgYyAtNDUuOTI4MTIsMC4wNTMxIC04My4xNDY4NywzNy4yNzE4OCAtODMuMiw4My4yIHYgNDIuMDkzNzUgYyAtNjguOTMxMjQ2LC03MC4zNTMxMyAtNjguMTYyNDk3LC0xODMuMTUgMS43MTg3NSwtMjUyLjU1OTM3IDY5Ljg4MTI1LC02OS40MDYyNTUgMTgyLjY4MTI1LC02OS40MDYyNTUgMjUyLjU2MjUsMCA2OS44ODEyNSw2OS40MDkzNyA3MC42NSwxODIuMjA2MjQgMS43MTg3NSwyNTIuNTU5MzcgeiBtIDAsMCIgDQoJCQlpZD0icGF0aDIiIHN0eWxlPSJzdHJva2Utd2lkdGg6MC44MDAwMDAwMTtmaWxsOiMxZWJkZDM7ZmlsbC1vcGFjaXR5OjEiLz4NCgk8cGF0aCBkPSJtIDI0MCw4MCBjIC0zNS4zNDY4OCwwIC02NCwyOC42NTMxMiAtNjQsNjQgMCwzNS4zNDY4OCAyOC42NTMxMiw2NCA2NCw2NCAzNS4zNDY4OCwwIDY0LC0yOC42NTMxMiA2NCwtNjQgLTAuMDM3NSwtMzUuMzMxMjUgLTI4LjY2ODc1LC02My45NjI1IC02NCwtNjQgeiBtIDAsMTE1LjIgYyAtMjguMjc4MTIsMCAtNTEuMiwtMjIuOTIxODggLTUxLjIsLTUxLjIgMCwtMjguMjc4MTIgMjIuOTIxODgsLTUxLjIgNTEuMiwtNTEuMiAyOC4yNzgxMiwwIDUxLjIsMjIuOTIxODggNTEuMiw1MS4yIC0wLjAzMTIsMjguMjYyNSAtMjIuOTM3NSw1MS4xNjg3NSAtNTEuMiw1MS4yIHogbSAwLDAiIA0KCQkJaWQ9InBhdGg0IiBzdHlsZT0ic3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNzk5ODAwMDQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtmaWxsOiMxZWJkZDM7ZmlsbC1vcGFjaXR5OjEiLz4NCjwvc3ZnPg==') },
        { text: 'indiener', style: 'question' },
        { text: this.personData.naam.aanschrijfwijze, style: 'answer' }]
    ];

    if (this.containsAddressQuestion(this.order)) {
      body.push([{ width: 15, height: 15, svg: this.dataUrlToSvg('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiANCgkJdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmNWY1ZjU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMzMyOTk5OTQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm5vcm1hbCIgDQoJCQlpZD0icGF0aDUyOTAiIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgLz4NCgk8ZyBpZD0iZzQ3MzgiIHRyYW5zZm9ybT0ibWF0cml4KDAuOCwwLDAsMC44LDYsNikiIHN0eWxlPSJmaWxsOiMxZWJkZDM7ZmlsbC1vcGFjaXR5OjEiPg0KCQk8cGF0aCBkPSJtIDI5Ljk2NDIxMiwyNi4yNzU3IGMgMy4wODgsMCA1LjYsLTIuNTEyOCA1LjYsLTUuNiAwLC0zLjA4NzIgLTIuNTEyLC01LjYgLTUuNiwtNS42IC0zLjA4OCwwIC01LjYsMi41MTI4IC01LjYsNS42IDAsMy4wODcyIDIuNTEyLDUuNiA1LjYsNS42IHogbSAwLC05LjYgYyAyLjIwNTYsMCA0LDEuNzk0NCA0LDQgMCwyLjIwNTYgLTEuNzk0NCw0IC00LDQgLTIuMjA1NiwwIC00LC0xLjc5NDQgLTQsLTQgMCwtMi4yMDU2IDEuNzk0NCwtNCA0LC00IHoiIA0KCQkJCWlkPSJwYXRoNDczMiIgc3R5bGU9InN0cm9rZS13aWR0aDowLjgwMDAwMDAxO2ZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSIgLz4NCgkJPHBhdGggZD0ibSAyOS44MjI2MTIsNDkuMjgxMyAxMi4yNzI4LC0xNy43MjU2IGMgNC42MDMyLC02LjEzNjggMy45Mzc2LC0xNi4yMjQgLTEuNDI0OCwtMjEuNTg1NiAtMi44OTc2LC0yLjg5ODQgLTYuNzUwNCwtNC40OTQ0IC0xMC44NDgsLTQuNDk0NCAtNC4wOTc2LDAgLTcuOTUwNCwxLjU5NiAtMTAuODQ4LDQuNDkzNiAtNS4zNjI0LDUuMzYxNiAtNi4wMjgsMTUuNDQ4OCAtMS40NDMyLDIxLjU2MTYgeiBtIC05LjcxNjgsLTM4LjE4MDggYyAyLjU5NiwtMi41OTUyIDYuMDQ2NCwtNC4wMjQ4IDkuNzE2OCwtNC4wMjQ4IDMuNjcwNCwwIDcuMTIwOCwxLjQyOTYgOS43MTY4LDQuMDI0OCA0Ljg0LDQuODM5MiA1LjQzNiwxMy45NDk2IDEuMjU4NCwxOS41MTkyIGwgLTEwLjk3NTIsMTUuODUwNCAtMTAuOTkyOCwtMTUuODc0NCBjIC00LjE2LC01LjU0NTYgLTMuNTYzMiwtMTQuNjU2IDEuMjc2LC0xOS40OTUyIHoiIA0KCQkJCWlkPSJwYXRoNDczNCIgc3R5bGU9InN0cm9rZS13aWR0aDowLjgwMDAwMDAxO2ZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSIgLz4NCgkJPHBhdGggZD0ibSAzOS42OTM2LDQ0LjcwNTUxOSBjIC0wLjQ0LC0wLjA1MzYgLTAuODM2OCwwLjI2MTYgLTAuODg4LDAuNzAwOCAtMC4wNTEyLDAuNDM5MiAwLjI2MjQsMC44MzY4IDAuNzAwOCwwLjg4OCA4LjQxMjgsMC45OTA0IDEyLjg5MzYsMy42NTkyIDEyLjg5MzYsNS4yMDU2IDAsMi4xNzEyIC04LjUyMTYsNS4yIC0yMi40LDUuMiAtMTMuODc4NCwwIC0yMi40LC0zLjAyODggLTIyLjQsLTUuMiAwLC0xLjU0NjQgNC40ODA4LC00LjIxNTIgMTIuODkzNiwtNS4yMDU2IDAuNDM4NCwtMC4wNTEyIDAuNzUyLC0wLjQ0OTYgMC43MDA4LC0wLjg4OCAtMC4wNTIsLTAuNDM5MiAtMC40NDg4LC0wLjc1NiAtMC44ODgsLTAuNzAwOCAtOC40MjMyLDAuOTkyIC0xNC4zMDY0LDMuNzg1NiAtMTQuMzA2NCw2Ljc5NDQgMCwzLjM3OTIgOC4yNDQsNi44IDI0LDYuOCAxNS43NTYsMCAyNCwtMy40MjA4IDI0LC02LjggMCwtMy4wMDg4IC01Ljg4MzIsLTUuODAyNCAtMTQuMzA2NCwtNi43OTQ0IHoiIA0KCQkJCWlkPSJwYXRoNDczNiIgc3R5bGU9InN0cm9rZS13aWR0aDowLjgwMDAwMDAxO2ZpbGw6IzFlYmRkMztmaWxsLW9wYWNpdHk6MSIgLz4NCgk8L2c+DQo8L3N2Zz4=') },
        { text: 'oud adres', style: 'question' },
        { text: this.formatAddress(this.personData.verblijfplaats), style: 'answer' }]);
    }
    this.order.filter((o) => o.question && o.question !== 'END').forEach((o) => {
      const dataRow = [];
      const question = this.questions.find(function(item) { return item.id === o.question; });
      if (Array.isArray(o.valueTitle)) {
        if (o.valueTitle.length > 0) {
          dataRow.push({ svg: this.dataUrlToSvg(question.fieldIcon), width: 15, height: 15 });
          dataRow.push({ text: o.keyTitle, style: 'question' });
          dataRow.push({ text: o.valueTitle.filter(function(el) {return el != null && el != '';}).join('\n'), style: 'answer' });
        }
      } else {
        dataRow.push({ svg: this.dataUrlToSvg(question.fieldIcon), width: 15, height: 15 });
        dataRow.push({ text: o.keyTitle, style: 'question' });
        dataRow.push({ text: o.valueTitle, style: 'answer' });
      }
      body.push(dataRow);
    });

    return {
      table: {
        widths: [20, 'auto', '*'],
        body: body,
      },
      layout: 'noBorders',
      margin: [0, 40, 0, 0],
    };
  }

  _stop() {
    if (this.journey.isDeepLink && this.journey.successUrl) {
      store.dispatch(requestJwtLogout(this.journey.stopUrl));
    } else {
      store.dispatch(selectPage('home'));
    }
  }

  _prev() {
    store.dispatch(orderPrev());
  }

  _title(journey) {
    return journey && journey.title ? journey.title : 'Naamloos';
  }

  _getOrderItems(order) {
    const returnable = [];
    order.filter((o) => o.question && o.question !== 'END').forEach((o) => {
      const question = this.questions.find(function(item) { return item.id === o.question; });
      if (Array.isArray(o.valueTitle)) {
        if (o.valueTitle.length > 0) {
          returnable.push({ key: o.keyTitle, value: o.valueTitle.filter(function (el) { return el != null && el != ''; }).join('\n'), image: question.fieldIcon });
        }
      } else {
        returnable.push({ key: o.keyTitle, value: o.valueTitle, image: question.fieldIcon });
      }
    });
    return returnable;
  }

  containsAddressQuestion(order) {
    for (var i = 0; i < order.length; i++) {
      // We use the 'property' of the question. We are looking for the 'address' type question, but for some reason Conduction
      // expects the key to be 'adress'
      if (order[i].key == 'adress') {
        return true;
      }
    }
    return false;
  }

  _skipCallback(question) {
    if (question && question.optional && question.optional.goto) {
      return (skip) => skip(question.optional.goto);
    }
    return null;
  }

  _isDisabled() {
    return false;
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

    var checkTitle = this.journey.end ? this.journey.end.check ? this.journey.end.check.title : '' : '';
    var checkSubTitle = this.journey.end ? this.journey.end.check ? this.journey.end.check.subtitle : '' : '';
    var successTitle = this.journey.end ? this.journey.end.success ? this.journey.end.success.title : '' : '';
    var successSubTitle = this.journey.end ? this.journey.end.success ? this.journey.end.success.subtitle : '' : '';

    this.current = state.order.current;
    this.id = this.current === JOURNEY_START ? JOURNEY_START : JOURNEY_END;
    this.question = { type: 'end' };
    this.questions = state.journey.questions;
    this.order = state.order.data;
    this.order_status_not_send = (state.order.order_status === ORDER_STATUS_NOT_SEND);
    this.order_status_sending = (state.order.order_status === ORDER_STATUS_SENDING);
    this.order_status_send_ok = (state.order.order_status === ORDER_STATUS_SEND_OK);
    this.order_status_send_failed = (state.order.order_status === ORDER_STATUS_SEND_FAILED);
    this.order_show_buttons = this.order_status_not_send || this.order_status_send_failed;
    this.order_end_title = this.order_show_buttons ? checkTitle : successTitle;
    this.order_end_sub_title = this.order_show_buttons ? checkSubTitle : successSubTitle;
    this.order_reponse_data = this.order_status_send_ok ? state.order.response_data.href : '';
    if (this.journey.title === 'Ik ga verhuizen') {
      this.show_journey_icon_truck = true;
      this.show_journey_icon_bulb = false;
    } else {
      this.show_journey_icon_truck = false;
      this.show_journey_icon_bulb = true;
    }
    this.orderDate = state.order.orderDate;

    if (this.id === JOURNEY_END && (state.person.status === undefined || state.person.status === CLEAR_PERSON_DATA)) {
      store.dispatch(requestPersonData());
    } else {
      this.personData = state.person.data;
    }
  }
}

window.customElements.define('playback-screen-end', PlaybackScreenEnd);
