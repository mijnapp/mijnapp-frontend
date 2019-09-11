import { JOURNEY_START, ORDER_STATUS_SENDING, ORDER_STATUS_SEND_OK, ORDER_STATUS_NOT_SEND, ORDER_STATUS_SEND_FAILED  } from '../../helpers/common';
import {
  ORDER_SAVE_ANSWER,
  ORDER_CLEAR_ANSWER,
  ORDER_NEXT,
  ORDER_PREV,
  ORDER_SKIP,
} from '../actions/order';
import { SET_JOURNEY } from '../actions/journey';
import { REQUEST_ORDERS_SUBMIT, REQUEST_ORDERS_SUBMIT_SUCCESS, REQUEST_ORDERS_SUBMIT_FAILED } from '../actions/orders'

export const order = (state = { data: [], current: JOURNEY_START, skipList: [], }, action) => {
  switch (action.type) {
    case SET_JOURNEY:
      return { data: [], current: JOURNEY_START, order_status: ORDER_STATUS_NOT_SEND, skipList: [], };
    case ORDER_SAVE_ANSWER:
    case ORDER_CLEAR_ANSWER:
      return {
        ...state,
        data: state.data.map(
          (o, i) => (i === state.current ? item(o, action) : o)
        ),
      };
    case ORDER_NEXT: {
      const nextCurrent = calcNextIndex(state.skipList, state.current);
      return {
        ...state,
        current: nextCurrent,
        data: [...state.data, item(null, action)],
      };
    }
    case ORDER_PREV: {
      const prevCurrent = calcPrevIndex(state.skipList, state.current);
      return {
        ...state,
        current: prevCurrent,
      };
    }
    case ORDER_SKIP:
      return {
        ...state,
        skipList: [...state.skipList, action.index],
      };
    case REQUEST_ORDERS_SUBMIT:
      return { ...state, order_status: ORDER_STATUS_SENDING }
    case REQUEST_ORDERS_SUBMIT_SUCCESS:
      return { ...state, order_status: ORDER_STATUS_SEND_OK }
    case REQUEST_ORDERS_SUBMIT_FAILED:
      return { ...state, order_status: ORDER_STATUS_SEND_FAILED }
    default:
      return state;
  }
};

const calcNextIndex = function (skipList, current) {
  var next = 0;
  if (current !== JOURNEY_START) {
    next = current + 1;
  }

  while (skipList.includes(next)) {
    next++;
  }
  return next;
};

const calcPrevIndex = function (skipList, current) {
  var next = current - 1;
  while (skipList.includes(next)) {
    next--;
  }
  return next < 0 ? JOURNEY_START : next;;
};

const item = (
  state = {
    question: null,
    key: null,
    value: null,
    keyTitle: null,
    valueTitle: null,
    _tracker: null,
  },
  action
) => {
  switch (action.type) {
    case ORDER_SAVE_ANSWER:
      return {
        ...state,
        key: action.key,
        value: action.value,
        keyTitle: action.keyTitle,
        valueTitle: action.valueTitle,
        _tracker: action._tracker,
      };
    case ORDER_CLEAR_ANSWER:
      return {
        ...state,
        key: null,
        value: null,
        keyTitle: null,
        valueTitle: null,
        _tracker: null,
      };
    case ORDER_NEXT:
      return {
        ...state,
        question: action.question,
      };
    default:
      return state;
  }
};
