import { store } from '../store';

export const xAuth = () => {
  const state = store.getState();
  return state.jwt && state.jwt.headers && state.jwt.headers.authorization
    ? state.jwt.headers.authorization
    : '';
};
