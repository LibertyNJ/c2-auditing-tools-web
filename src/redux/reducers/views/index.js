import { CHANGE_PARAMETER, RECEIVE_RECORDS, SORT_RECORDS } from '../../actions/types';

export const INITIAL_STATE = {};

export default function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_PARAMETER:
      return {
        ...state,
        [action.view]: {
          ...state[action.view],
          parameters: {
            ...state[action.view].parameters,
            [action.name]: action.value,
          },
        },
      };
    case RECEIVE_RECORDS:
      return {
        ...state,
        [action.view]: {
          ...state[action.view],
          records: [...action.records],
        },
      };
    case SORT_RECORDS:
      return {
        ...state,
        [action.view]: {
          ...state[action.view],
          sortBy: action.sortBy,
          sortDirection:
            action.sortBy === state[action.view].sortBy
              ? state[action.view].sortDirection === 'ASC'
                ? 'DESC'
                : 'ASC'
              : 'ASC',
        },
      };
    default:
      return state;
  }
}
