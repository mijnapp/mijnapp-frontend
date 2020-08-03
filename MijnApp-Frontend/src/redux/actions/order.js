export const ORDER_SAVE_ANSWER = 'ORDER_SAVE_ANSWER';
export const orderSaveAnswer = (
  key,
  value,
  keyTitle,
  valueTitle,
  warning,
  _tracker
) => ({
  type: ORDER_SAVE_ANSWER,
  key,
  value,
  keyTitle,
  valueTitle,
  warning,
  _tracker,
});

export const ORDER_CLEAR_ANSWER = 'ORDER_CLEAR_ANSWER';
export const orderClearAnswer = () => ({ type: ORDER_CLEAR_ANSWER });

export const ORDER_NEXT = 'ORDER_NEXT';
export const orderNext = (question) => ({
  type: ORDER_NEXT,
  question,
});
export const ORDER_PREV = 'ORDER_PREV';
export const orderPrev = () => ({ type: ORDER_PREV });
export const ORDER_SKIP = 'ORDER_SKIP';
export const orderSkip = (index) => ({ type: ORDER_SKIP, index });
