import {
  CHANGE_FORM_FIELD,
  RECEIVE_REQUEST_TABLE_RECORDS_ERROR,
  RECEIVE_FORM_DATA,
  RECEIVE_TABLE_RECORDS,
  REQUEST_TABLE_RECORDS,
  RESET_FORM_FIELDS,
} from '../../actions/types';
import { deepCloneObject } from '../../../util';

export const INITIAL_STATE = {
  administrations: {
    data: {},
    fields: {
      dateEnd: '',
      dateStart: '',
      medication: '',
      medicationOrderId: '',
      provider: '',
    },
    isSubmitted: false,
  },
  editProvider: {
    data: {
      assignedProviderAdcs: [],
      assignedProviderEmars: [],
      editFirstName: '',
      editLastName: '',
      editMiddleInitial: '',
      providerId: null,
      unassignedProviderAdcs: [],
      unassignedProviderEmars: [],
    },
    fields: {
      adcUsernameIdsToAssign: [],
      adcUsernameIdsToUnassign: [],
      emarUsernameIdsToAssign: [],
      emarUsernameIdsToUnassign: [],
      firstName: '',
      lastName: '',
      middleInitial: '',
    },
    isSubmitted: false,
  },
  importData: {
    data: {},
    fields: {},
    isSubmitted: false,
  },
  ledger: {
    data: {},
    fields: {
      dateEnd: '',
      dateStart: '',
      medicationOrderId: '',
      product: '',
      provider: '',
    },
    isSubmitted: false,
  },
  providers: {
    data: {},
    fields: {
      adcUsername: '',
      emarUsername: '',
      firstName: '',
      lastName: '',
      middleInitial: '',
    },
    isSubmitted: false,
  },
  transactions: {
    data: {},
    fields: {
      dateEnd: '',
      dateStart: '',
      medicationOrderId: '',
      product: '',
      provider: '',
      transactionTypes: [],
    },
    isSubmitted: false,
  },
};

export default function formsReducer(
  state = deepCloneObject(INITIAL_STATE),
  action
) {
  switch (action.type) {
    case CHANGE_FORM_FIELD: {
      const nextState = deepCloneObject(state);
      nextState[action.form].fields[action.name] = action.value;
      return nextState;
    }
    case RECEIVE_FORM_DATA: {
      const nextState = deepCloneObject(state);
      const form = nextState[action.form];
      form.data = { ...action.data };
      form.fields = { ...INITIAL_STATE[action.form].fields };
      form.fields = populateFormDataInFields(form);
      return nextState;
    }
    case RECEIVE_REQUEST_TABLE_RECORDS_ERROR: {
      const nextState = deepCloneObject(state);
      const form = nextState[action.table];
      form.isSubmitted = false;
      return nextState;
    }
    case RECEIVE_TABLE_RECORDS: {
      const nextState = deepCloneObject(state);
      const form = nextState[action.table];
      form.isSubmitted = false;
      return nextState;
    }
    case REQUEST_TABLE_RECORDS: {
      const nextState = deepCloneObject(state);
      const form = nextState[action.table];
      form.isSubmitted = true;
      return nextState;
    }
    case RESET_FORM_FIELDS: {
      const nextState = deepCloneObject(state);
      const form = nextState[action.form];
      form.fields = { ...INITIAL_STATE[action.form].fields };
      form.fields = populateFormDataInFields(form);
      return nextState;
    }
    default:
      return state;
  }
}

function populateFormDataInFields(form) {
  const formFields = {};
  const fieldNames = Object.keys(form.fields);
  fieldNames.forEach(fieldName => {
    formFields[fieldName] = isFieldInData(fieldName, form.data)
      ? form.data[fieldName] || ''
      : form.fields[fieldName];
  });
  return formFields;
}

function isFieldInData(field, data) {
  return Object.prototype.hasOwnProperty.call(data, field);
}
