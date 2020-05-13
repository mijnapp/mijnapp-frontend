import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../../redux/store';
import { selectPage } from '../../../../redux/actions/application';
import { requestOrdersSubmit } from '../../../../redux/actions/orders';
import { orderPrev } from '../../../../redux/actions/order';
import { requestPersonData, CLEAR_PERSON_DATA } from '../../../../redux/actions/person';
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
    //store.dispatch(selectPage('home'));
    window.location = 'https://www.s-hertogenbosch.nl/verhuizen';
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
