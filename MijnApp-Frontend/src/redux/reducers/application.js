import { SELECT_PAGE, SELECT_PAGE_NO_HISTORY, NEXT_PAGE_AFTER_LOGIN } from '../actions/application';
import { REQUEST_JWT_LOGOUT_SUCCESS } from '../actions/jwt';

export const application = (state = { page: 'signin' }, action) => {
  switch (action.type) {
    case REQUEST_JWT_LOGOUT_SUCCESS:
    case SELECT_PAGE:
    case SELECT_PAGE_NO_HISTORY:
      return {
        ...state,
        page: action.page || 'signin',
        data: null,
      };
    case NEXT_PAGE_AFTER_LOGIN:
      return state;
    default:
      return state;
  }
};
