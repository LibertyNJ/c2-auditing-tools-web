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
    const state = {
      baz: {
        parameters: {
          foo: 'zip',
        },
      },
    };
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

  test('Returns state with records set and sorting properties set to null on RECEIVE_RECORDS action.', () => {
    const action = {
      records: ['foo'],
      type: RECEIVE_RECORDS,
      view: 'bar',
    };
    const state = {
      bar: {
        records: [],
        sortBy: 'baz',
        sortDirection: 'ASC',
      },
    };
    expect(viewsReducer(state, action)).toEqual({
      ...state,
      bar: {
        ...state.bar,
        records: ['foo'],
        sortBy: null,
        sortDirection: null,
      },
    });
  });

  describe('Handles SORT_RECORDS action.', () => {
    describe('SortBy data type is a number.', () => {
      test('Returns state with sort properties set and records sorted when passed sort direction is "ASC".', () => {
        const action = {
          sortBy: 'foo',
          sortDirection: 'ASC',
          type: SORT_RECORDS,
          view: 'bar',
        };
        const state = {
          bar: {
            records: [{ foo: 3 }, { foo: 1 }, { foo: 3 }, { foo: 2 }],
            sortBy: 'baz',
            sortDirection: 'DESC',
          },
        };
        expect(viewsReducer(state, action)).toEqual({
          ...state,
          bar: {
            ...state.bar,
            records: [{ foo: 1 }, { foo: 2 }, { foo: 3 }, { foo: 3 }],
            sortBy: 'foo',
            sortDirection: 'ASC',
          },
        });
      });
      test('Returns state with sort properties set and records sorted when passed sort direction is "DESC".', () => {
        const action = {
          sortBy: 'foo',
          sortDirection: 'DESC',
          type: SORT_RECORDS,
          view: 'bar',
        };
        const state = {
          bar: {
            records: [{ foo: 1 }, { foo: 3 }, { foo: 1 }, { foo: 2 }],
            sortBy: 'baz',
            sortDirection: 'ASC',
          },
        };
        expect(viewsReducer(state, action)).toEqual({
          ...state,
          bar: {
            ...state.bar,
            records: [{ foo: 3 }, { foo: 2 }, { foo: 1 }, { foo: 1 }],
            sortBy: 'foo',
            sortDirection: 'DESC',
          },
        });
      });
    });
    describe('SortBy data type is a string.', () => {
      test('Returns state with sort properties set and records sorted when passed sort direction is "ASC".', () => {
        const action = {
          sortBy: 'foo',
          sortDirection: 'ASC',
          type: SORT_RECORDS,
          view: 'bar',
        };
        const state = {
          bar: {
            records: [{ foo: 'c' }, { foo: 'a' }, { foo: 'c' }, { foo: 'b' }],
            sortBy: 'baz',
            sortDirection: 'DESC',
          },
        };
        expect(viewsReducer(state, action)).toEqual({
          ...state,
          bar: {
            ...state.bar,
            records: [{ foo: 'a' }, { foo: 'b' }, { foo: 'c' }, { foo: 'c' }],
            sortBy: 'foo',
            sortDirection: 'ASC',
          },
        });
      });
      test('Returns state with sort properties set and records sorted when passed sort direction is "DESC".', () => {
        const action = {
          sortBy: 'foo',
          sortDirection: 'DESC',
          type: SORT_RECORDS,
          view: 'bar',
        };
        const state = {
          bar: {
            records: [{ foo: 'a' }, { foo: 'c' }, { foo: 'a' }, { foo: 'b' }],
            sortBy: 'baz',
            sortDirection: 'ASC',
          },
        };
        expect(viewsReducer(state, action)).toEqual({
          ...state,
          bar: {
            ...state.bar,
            records: [{ foo: 'c' }, { foo: 'b' }, { foo: 'a' }, { foo: 'a' }],
            sortBy: 'foo',
            sortDirection: 'DESC',
          },
        });
      });
    });
  });
});
