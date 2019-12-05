import tablesReducer, { INITIAL_STATE } from './index';
import { RECEIVE_TABLE_RECORDS, SORT_TABLE_RECORDS } from '../../actions/types';

describe('tablesReducer(state, action)', () => {
  test('Returns initial state.', () => {
    const action = {};
    const state = undefined;
    expect(tablesReducer(state, action)).toEqual(INITIAL_STATE);
  });

  test('Returns state with records set and sorting properties set to null on RECEIVE_TABLE_RECORDS action.', () => {
    const action = {
      records: ['foo'],
      table: 'bar',
      type: RECEIVE_TABLE_RECORDS,
    };
    const state = {
      bar: {
        records: [],
        sortBy: 'baz',
        sortDirection: 'ASC',
      },
    };
    expect(tablesReducer(state, action)).toEqual({
      ...state,
      bar: {
        ...state.bar,
        records: ['foo'],
        sortBy: null,
        sortDirection: null,
      },
    });
  });

  describe('Handles SORT_TABLE_RECORDS action.', () => {
    describe('SortBy data type is a number.', () => {
      test('Returns state with sort properties set and records sorted when passed sort direction is "ASC".', () => {
        const action = {
          sortBy: 'foo',
          sortDirection: 'ASC',
          table: 'bar',
          type: SORT_TABLE_RECORDS,
        };
        const state = {
          bar: {
            records: [{ foo: 3 }, { foo: 1 }, { foo: 3 }, { foo: 2 }],
            sortBy: 'baz',
            sortDirection: 'DESC',
          },
        };
        expect(tablesReducer(state, action)).toEqual({
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
          table: 'bar',
          type: SORT_TABLE_RECORDS,
        };
        const state = {
          bar: {
            records: [{ foo: 1 }, { foo: 3 }, { foo: 1 }, { foo: 2 }],
            sortBy: 'baz',
            sortDirection: 'ASC',
          },
        };
        expect(tablesReducer(state, action)).toEqual({
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
          table: 'bar',
          type: SORT_TABLE_RECORDS,
        };
        const state = {
          bar: {
            records: [{ foo: 'c' }, { foo: 'a' }, { foo: 'c' }, { foo: 'b' }],
            sortBy: 'baz',
            sortDirection: 'DESC',
          },
        };
        expect(tablesReducer(state, action)).toEqual({
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
          table: 'bar',
          type: SORT_TABLE_RECORDS,
        };
        const state = {
          bar: {
            records: [{ foo: 'a' }, { foo: 'c' }, { foo: 'a' }, { foo: 'b' }],
            sortBy: 'baz',
            sortDirection: 'ASC',
          },
        };
        expect(tablesReducer(state, action)).toEqual({
          ...state,
          bar: {
            ...state.bar,
            records: [{ foo: 'c' }, { foo: 'b' }, { foo: 'a' }, { foo: 'a' }],
            sortBy: 'foo',
            sortDirection: 'DESC',
          },
        });
      });
      test('Handles null values.', () => {
        const action = {
          sortBy: 'foo',
          sortDirection: 'ASC',
          table: 'bar',
          type: SORT_TABLE_RECORDS,
        };
        const state = {
          bar: {
            records: [{ foo: 'c' }, { foo: 'a' }, { foo: null }, { foo: 'c' }, { foo: 'b' }],
            sortBy: 'baz',
            sortDirection: 'DESC',
          },
        };
        expect(tablesReducer(state, action)).toEqual({
          ...state,
          bar: {
            ...state.bar,
            records: [{ foo: null }, { foo: 'a' }, { foo: 'b' }, { foo: 'c' }, { foo: 'c' }],
            sortBy: 'foo',
            sortDirection: 'ASC',
          },
        });
      });
    });
  });
});
