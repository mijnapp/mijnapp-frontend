const lastActionStorageKey = 'mijnApp-lastAction';

export const setLastAction = (lastAction) => {
  var lastActionString = JSON.stringify(lastAction);
  window.sessionStorage.setItem(lastActionStorageKey, lastActionString);
};

export const removeLastAction = () => {
  window.sessionStorage.removeItem(lastActionStorageKey);
};

export const getLastAction = () => {
  const lastActionString = window.sessionStorage.getItem(lastActionStorageKey);
  const lastAction = JSON.parse(lastActionString);
  return lastAction ? lastAction : '';
};
