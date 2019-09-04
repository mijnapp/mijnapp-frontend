import { store } from '../store';

export const jwtBearerToken = () => {
  const state = store.getState();
  return state.jwt && state.jwt.headers && state.jwt.headers.authorization
    ? state.jwt.headers.authorization
    : '';
};
