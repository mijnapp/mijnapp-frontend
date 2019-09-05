export const saveState = (state) => {
  const stringifiedState = JSON.stringify(state);
  localStorage.setItem('appState', stringifiedState);
};
export const loadState = () => {
  const json = localStorage.getItem('appState') || '{}';
  const state = JSON.parse(json);

  if (state) {
    return state;
  } else {
    return undefined; // To use the defaults in the reducers
  }
};
