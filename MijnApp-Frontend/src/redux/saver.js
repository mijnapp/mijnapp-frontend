const appStateStorageKey = 'mijnApp-appState';

export const saveState = (state) => {
  const stringifiedState = JSON.stringify(state);
  window.sessionStorage.setItem(appStateStorageKey, stringifiedState);
};
export const loadState = () => {
  const json = window.sessionStorage.getItem(appStateStorageKey) || '{}';
  const state = JSON.parse(json);

  if (state) {
    return state;
  } else {
    return undefined; // To use the defaults in the reducers
  }
};
export const clearState = () => {
  window.sessionStorage.setItem(appStateStorageKey, '{}');
};
