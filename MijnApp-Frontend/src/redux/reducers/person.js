import {
  REQUEST_PERSON_DATA,
  REQUEST_PERSON_DATA_SUCCESS,
  REQUEST_PERSON_DATA_FAILURE,
  CLEAR_PERSON_DATA,
  REQUEST_PERSONS_MOVING,
  REQUEST_PERSONS_MOVING_SUCCESS,
  REQUEST_PERSONS_MOVING_FAILURE,
  CLEAR_PERSONS_MOVING,
} from '../actions/person';

export const person = (state = { data: {} }, action) => {
  switch (action.type) {
    case REQUEST_PERSON_DATA:
      return state;
    case REQUEST_PERSON_DATA_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
      };
    case REQUEST_PERSON_DATA_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case CLEAR_PERSON_DATA:
      return {
        data: {},
      };
    case REQUEST_PERSONS_MOVING:
      return {
        ...state,
        movingPersonsFetched: true,
      };
    case REQUEST_PERSONS_MOVING_SUCCESS:
      return {
        ...state,
        movingPersons: action.data,
        error: null,
      };
    case REQUEST_PERSONS_MOVING_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case CLEAR_PERSONS_MOVING:
      return {
        ...state,
        movingPersons: [],
        movingPersonsFetched: false,
      };
    default:
      return state;
  }
};
