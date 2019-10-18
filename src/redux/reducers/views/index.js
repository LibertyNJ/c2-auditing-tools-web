import getSortedRecords from './get-sorted-records';
import { CHANGE_PARAMETER, RECEIVE_RECORDS, SORT_RECORDS } from '../../actions/types';

export const INITIAL_STATE = {
  administrations: {
    parameters: {
      datetimeEnd: '',
      datetimeStart: '',
      medication: '',
      medicationOrderId: '',
      provider: '',
    },
    records: [],
    sortBy: null,
    sortDirection: null,
  },
  ledger: {
    parameters: {
      datetimeEnd: '',
      datetimeStart: '',
      medicationOrderId: '',
      product: '',
      provider: '',
    },
    records: [],
    sortBy: null,
    sortDirection: null,
  },
  providers: {
    parameters: {
      adcId: '',
      emarId: '',
      firstName: '',
      lastName: '',
      middleInitial: '',
    },
    records: [],
    sortBy: null,
    sortDirection: null,
  },
  transactions: {
    parameters: {
      datetimeEnd: '',
      datetimeStart: '',
      medicationOrderId: '',
      product: '',
      provider: '',
      transactionTypes: [],
    },
    records: [],
    sortBy: null,
    sortDirection: null,
  },
};

export default function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_PARAMETER: {
      const nextState = { ...state };
      nextState[action.view].parameters[action.name] = action.value;
      return nextState;
    }
    case RECEIVE_RECORDS: {
      const nextState = { ...state };
      const view = nextState[action.view];
      view.records = [...action.records];
      view.sortBy = null;
      view.sortDirection = null;
      return nextState;
    }
    case SORT_RECORDS: {
      const nextState = { ...state };
      const view = nextState[action.view];
      view.records = getSortedRecords(
        [...state[action.view].records],
        action.sortBy,
        action.sortDirection,
      );
      view.sortBy = action.sortBy;
      view.sortDirection = action.sortDirection;
      return nextState;
    }
    default:
      return state;
  }
}
