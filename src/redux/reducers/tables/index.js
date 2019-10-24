import getSortedRecords from './get-sorted-records';
import { RECEIVE_TABLE_RECORDS, SORT_TABLE_RECORDS } from '../../actions/types';
import { deepCloneObject } from '../../../util';

export const INITIAL_STATE = {
  administrations: {
    records: [],
    sortBy: null,
    sortDirection: null,
  },
  ledger: {
    records: [],
    sortBy: null,
    sortDirection: null,
  },
  providers: {
    records: [],
    sortBy: null,
    sortDirection: null,
  },
  transactions: {
    records: [],
    sortBy: null,
    sortDirection: null,
  },
};

export default function tablesReducer(state = deepCloneObject(INITIAL_STATE), action) {
  switch (action.type) {
    case RECEIVE_TABLE_RECORDS: {
      const nextState = { ...state };
      const table = nextState[action.table];
      table.records = [...action.records];
      table.sortBy = null;
      table.sortDirection = null;
      return nextState;
    }
    case SORT_TABLE_RECORDS: {
      const nextState = { ...state };
      const table = nextState[action.table];
      table.records = getSortedRecords(
        [...state[action.table].records],
        action.sortBy,
        action.sortDirection,
      );
      table.sortBy = action.sortBy;
      table.sortDirection = action.sortDirection;
      return nextState;
    }
    default:
      return state;
  }
}
