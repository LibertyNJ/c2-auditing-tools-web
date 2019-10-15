import { DISMISS_ERROR, RECEIVE_ERROR } from '../../actions/types';

export const INITIAL_STATE = null;

export default function errorReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DISMISS_ERROR:
      return null;
    case RECEIVE_ERROR:
      return action.error;
    default:
      return state;
  }
}
