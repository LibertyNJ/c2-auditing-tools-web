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
    sortBy: '',
    sortDirection: '',
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
    sortBy: '',
    sortDirection: '',
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
    sortBy: '',
    sortDirection: '',
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
    sortBy: '',
    sortDirection: '',
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
        },
      };
    case SORT_RECORDS:
      return {
        ...state,
        [action.view]: {
          ...state[action.view],
          sortBy: action.sortBy,
          sortDirection: isSameSortBy(state, action) ? getSortDirection(state, action) : 'ASC',
        },
      };
    default:
      return state;
  }
}

function isSameSortBy(state, { sortBy, view }) {
  return state[view].sortBy === sortBy;
}

function getSortDirection(state, { view }) {
  return isSortDirectionAscending(state[view]) ? 'DESC' : 'ASC';
}

function isSortDirectionAscending(view) {
  return view.sortDirection === 'ASC';
}
