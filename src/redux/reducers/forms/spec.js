import formsReducer, { INITIAL_STATE } from './index';
import { CHANGE_FORM_FIELD, RECEIVE_FORM_DATA, RESET_FORM_FIELDS } from '../../actions/types';

describe('formsReducer(state, action)', () => {
  test('Returns initial state.', () => {
    const action = {};
    const state = undefined;
    expect(formsReducer(state, action)).toEqual(INITIAL_STATE);
  });

  test('Returns state with parameter set on CHANGE_FORM_FIELD action.', () => {
    const action = {
      form: 'baz',
      name: 'foo',
      type: CHANGE_FORM_FIELD,
      value: 'bar',
    };
    const state = {
      baz: {
        fields: {
          foo: 'zip',
        },
      },
    };
    expect(formsReducer(state, action)).toEqual({
      ...state,
      baz: {
        ...state.baz,
        fields: {
          ...state.baz.fields,
          foo: 'bar',
        },
      },
    });
  });

  test('Returns state with data set and fields populated with data on RECEIVE_FORM_DATA action.', () => {
    const action = {
      data: { foo: 'bar' },
      form: 'baz',
      type: RECEIVE_FORM_DATA,
    };
    const state = {
      baz: {
        data: { foo: 'zip' },
        fields: { foo: 'zot' },
      },
    };
    expect(formsReducer(state, action)).toEqual({
      ...state,
      baz: {
        ...state.baz,
        data: { foo: 'bar' },
        fields: { foo: 'bar' },
      },
    });
  });

  test('Returns state with fields set to INITIAL_STATE and populated with data on RESET_FORM_FIELDS action.', () => {
    const action = {
      form: 'administrations',
      type: RESET_FORM_FIELDS,
    };
    const state = {
      administrations: {
        data: {
          datetimeEnd: 'fiz',
        },
        fields: {
          datetimeEnd: 'foo',
          datetimeStart: 'bar',
          medication: 'baz',
          medicationOrderId: 'zip',
          provider: 'zot',
        },
      },
    };
    expect(formsReducer(state, action)).toEqual({
      administrations: {
        ...state.administrations,
        fields: {
          ...INITIAL_STATE.administrations.fields,
          datetimeEnd: 'fiz',
        },
      },
    });
  });
});
