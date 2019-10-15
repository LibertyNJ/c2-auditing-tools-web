import viewsReducer, { INITIAL_STATE } from './index';
import { CHANGE_PARAMETER, RECEIVE_RECORDS, SORT_RECORDS } from '../../actions/types';

describe('viewsReducer(state, action)', () => {
  test('Returns initial state.', () => {
    const action = {};
    const state = undefined;
    expect(viewsReducer(state, action)).toEqual(INITIAL_STATE);
  });

  test('Returns state with parameter set on CHANGE_PARAMETER action.', () => {
    const action = {
      name: 'foo',
      type: CHANGE_PARAMETER,
      value: 'bar',
      view: 'baz',
    };
    const state = INITIAL_STATE;
    expect(viewsReducer(state, action)).toEqual({
      ...state,
      baz: {
        ...state.baz,
        parameters: {
          ...state.baz.parameters,
          foo: 'bar',
        },
      },
    });
  });

  test('Returns state with records set on RECEIVE_RECORDS action.', () => {
    const action = {
      records: ['foo'],
      type: RECEIVE_RECORDS,
      view: 'bar',
    };
    const state = INITIAL_STATE;
    expect(viewsReducer(state, action)).toEqual({
      ...state,
      bar: {
        ...state.bar,
        records: ['foo'],
      },
    });
  });

  describe('Handles SORT_RECORDS action.', () => {
    const action = {
      sortBy: 'foo',
      type: SORT_RECORDS,
      view: 'bar',
    };
    test('Returns state with sortBy set and sortDirection set to ASC when passed state sortBy differs with action sortBy.', () => {
      const state = {
        bar: {
          sortBy: 'baz',
          sortDirection: 'ASC',
        },
      };
      expect(viewsReducer(state, action)).toEqual({
        ...state,
        bar: {
          ...state.bar,
          sortBy: 'foo',
          sortDirection: 'ASC',
        },
      });
    });

    test('Returns state with sortDirection set to DESC when passed state sortDirection is ASC and sortBy is the same as action sortBy', () => {
      const state = {
        bar: {
          sortBy: 'foo',
          sortDirection: 'ASC',
        },
      };
      expect(viewsReducer(state, action)).toEqual({
        ...state,
        bar: {
          ...state.bar,
          sortBy: 'foo',
          sortDirection: 'DESC',
        },
      });
    });

    test('Returns state with sortDirection set to ASC when passed state sortDirection is DESC and sortBy is the same as action sortBy', () => {
      const state = {
        bar: {
          sortBy: 'foo',
          sortDirection: 'DESC',
        },
      };
      expect(viewsReducer(state, action)).toEqual({
        ...state,
        bar: {
          ...state.bar,
          sortBy: 'foo',
          sortDirection: 'ASC',
        },
      });
    });
  });
});
