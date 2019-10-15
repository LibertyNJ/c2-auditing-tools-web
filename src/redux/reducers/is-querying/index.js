import { QUERY_RECORDS, RECEIVE_ERROR, RECEIVE_RECORDS } from '../../actions/types';

export const INITIAL_STATE = false;

export default function isQueryingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case QUERY_RECORDS:
      return true;
    case RECEIVE_ERROR:
    case RECEIVE_RECORDS:
      return false;
    default:
      return state;
  }
}
