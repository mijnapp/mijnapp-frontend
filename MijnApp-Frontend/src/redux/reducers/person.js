import {
  REQUEST_PERSON_DATA,
  REQUEST_PERSON_DATA_SUCCESS,
  REQUEST_PERSON_DATA_FAILURE,
  CLEAR_PERSON_DATA,
  REQUEST_PERSONS_MOVING,
  REQUEST_PERSONS_MOVING_SUCCESS,
  REQUEST_PERSONS_MOVING_FAILURE,
  CLEAR_PERSONS_MOVING,
  REQUEST_PERSONS_MOVING_SKIPQUESTION,
} from '../actions/person';

export const person = (state = { data: {}, movingPersonsStatus: CLEAR_PERSONS_MOVING, }, action) => {
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
        movingPersonsStatus: REQUEST_PERSONS_MOVING,
      };
    case REQUEST_PERSONS_MOVING_SUCCESS: {
        console.log(action.data);
        console.log(action.data.length === 0);
      return {
        ...state,
        movingPersons: action.data,
        movingPersonsStatus: action.data.length === 0 ? REQUEST_PERSONS_MOVING_SKIPQUESTION : REQUEST_PERSONS_MOVING_SUCCESS,
        error: null,
      };
    }
    case REQUEST_PERSONS_MOVING_FAILURE:
      return {
        ...state,
        error: action.error,
        movingPersonsStatus: REQUEST_PERSONS_MOVING_FAILURE,
      };
    case CLEAR_PERSONS_MOVING:
      return {
        ...state,
        movingPersons: [],
        movingPersonsStatus: CLEAR_PERSONS_MOVING,
      };
    case REQUEST_PERSONS_MOVING_SKIPQUESTION: {
      console.log(REQUEST_PERSONS_MOVING_SKIPQUESTION);
      return {
        ...state,
        movingPersonsStatus: REQUEST_PERSONS_MOVING_SUCCESS
      };
    }
    default:
      return state;
  }
};
