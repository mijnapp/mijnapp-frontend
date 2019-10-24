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
    REQUEST_PERSONS_MOVING_SELECT_ALL,
} from '../actions/person';
import { REQUEST_JWT_LOGOUT_SUCCESS } from '../actions/jwt';

export const person = (state = { data: {}, status: CLEAR_PERSON_DATA, movingPersonsStatus: CLEAR_PERSONS_MOVING, }, action) => {
    switch (action.type) {
        case REQUEST_PERSON_DATA:
            return {
                ...state,
                searching: true,
                status: REQUEST_PERSON_DATA,
            }
        case REQUEST_PERSON_DATA_SUCCESS:
            return {
                ...state,
                searching: false,
                data: action.data,
                error: null,
                status: REQUEST_PERSON_DATA_SUCCESS,
            };
        case REQUEST_PERSON_DATA_FAILURE:
            return {
                ...state,
                searching: false,
                error: action.error,
                status: REQUEST_PERSON_DATA_FAILURE,
            };
        case CLEAR_PERSON_DATA:
            return {
                data: {},
                searching: false,
                status: CLEAR_PERSON_DATA,
            };
        case REQUEST_PERSONS_MOVING:
            return {
                ...state,
                movingPersonsSearching: true,
                movingPersonsStatus: REQUEST_PERSONS_MOVING,
            };
        case REQUEST_PERSONS_MOVING_SUCCESS: {
            return {
                ...state,
                movingPersons: action.data,
                movingPersonsSearching: false,
                movingPersonsStatus: action.data.length === 1 ? REQUEST_PERSONS_MOVING_SKIPQUESTION : REQUEST_PERSONS_MOVING_SELECT_ALL,
                error: null,
            };
        }
        case REQUEST_PERSONS_MOVING_FAILURE:
            return {
                ...state,
                error: action.error,
                movingPersonsSearching: false,
                movingPersonsStatus: REQUEST_PERSONS_MOVING_FAILURE,
            };
        case CLEAR_PERSONS_MOVING:
            return {
                ...state,
                movingPersons: [],
                movingPersonsSearching: false,
                movingPersonsStatus: CLEAR_PERSONS_MOVING,
            };
        case REQUEST_PERSONS_MOVING_SKIPQUESTION:
            return {
                ...state,
                movingPersonsSearching: false,
                movingPersonsStatus: REQUEST_PERSONS_MOVING_SUCCESS
            };
        case REQUEST_PERSONS_MOVING_SELECT_ALL:
            return {
                ...state,
                movingPersonsSearching: false,
                movingPersonsStatus: REQUEST_PERSONS_MOVING_SUCCESS
            };
        case REQUEST_JWT_LOGOUT_SUCCESS:
            return { data: {}, status: CLEAR_PERSON_DATA, movingPersonsStatus: CLEAR_PERSONS_MOVING, };
        default:
            return state;
    }
};
