import { CHANGE_FORM_FIELD, RECEIVE_FORM_DATA, RESET_FORM_FIELDS } from '../../actions/types';
import { deepCloneObject } from '../../../util';

export const INITIAL_STATE = {
  administrations: {
    data: {},
    fields: {
      datetimeEnd: '',
      datetimeStart: '',
      medication: '',
      medicationOrderId: '',
      provider: '',
    },
  },
  importData: {
    data: {},
    fields: {
      c2ActivityReport: '',
      c2ActivityReportPath: '',
      medicationOrderTaskStatusDetailReport: '',
      medicationOrderTaskStatusDetailReportPath: '',
    },
  },
  editProvider: {
    data: {
      assignedProviderAdcs: [],
      assignedProviderEmars: [],
      firstName: '',
      lastName: '',
      middleInitial: '',
      providerId: null,
      unassignedProviderAdcs: [],
      unassignedProviderEmars: [],
    },
    fields: {
      firstName: '',
      lastName: '',
      middleInitial: '',
      providerAdcIdsToBeAssigned: [],
      providerAdcIdsToBeUnassigned: [],
      providerEmarIdsToBeAssigned: [],
      providerEmarIdsToBeUnassigned: [],
    },
  },
  ledger: {
    data: {},
    fields: {
      datetimeEnd: '',
      datetimeStart: '',
      medicationOrderId: '',
      product: '',
      provider: '',
    },
  },
  providers: {
    data: {},
    fields: {
      adcName: '',
      emarName: '',
      firstName: '',
      lastName: '',
      middleInitial: '',
    },
  },
  transactions: {
    data: {},
    fields: {
      datetimeEnd: '',
      datetimeStart: '',
      medicationOrderId: '',
      product: '',
      provider: '',
      transactionTypes: [],
    },
  },
};

export default function formsReducer(state = deepCloneObject(INITIAL_STATE), action) {
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
  fieldNames.forEach((fieldName) => {
    formFields[fieldName] = isFieldInData(fieldName, form.data)
      ? form.data[fieldName] || ''
      : form.fields[fieldName];
  });
  return formFields;
}

function isFieldInData(field, data) {
  return Object.prototype.hasOwnProperty.call(data, field);
}
