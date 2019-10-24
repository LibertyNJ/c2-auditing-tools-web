import { RECEIVE_DATABASE_STATUS } from '../../actions/types';

export const INITIAL_STATE = 'Unknown';

export default function databaseStatusReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RECEIVE_DATABASE_STATUS:
      return action.status;
    default:
      return state;
  }
}
