import { SET_JOURNEYS } from '../actions/journeys';
import { REQUEST_JWT_LOGOUT_SUCCESS } from '../actions/jwt';

export const journeys = (state = { data: [] }, action) => {
  switch (action.type) {
  case SET_JOURNEYS:
    return {
      ...state,
      data: action.data,
    };
  case REQUEST_JWT_LOGOUT_SUCCESS:
    return { data: [] };
  default:
    return state;
  }
};
