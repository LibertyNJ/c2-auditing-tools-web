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
          sortBy: null,
          sortDirection: null,
        },
      };
    case SORT_RECORDS:
      return {
        ...state,
        [action.view]: {
          ...state[action.view],
          records: getSortedRecords(
            [...state[action.view].records],
            action.sortBy,
            action.sortDirection,
          ),
          sortBy: action.sortBy,
          sortDirection: action.sortDirection,
        },
      };
    default:
      return state;
  }
}
