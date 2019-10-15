import rootReducer, { INITIAL_STATE } from './index';
import {
  CHANGE_PARAMETER,
  DISMISS_ERROR,
  QUERY_RECORDS,
  RECEIVE_ERROR,
  RECEIVE_RECORDS,
  SORT_RECORDS,
} from '../actions/types';

describe('rootReducer(state, action)', () => {
  test('Returns initial state.', () => {
    const action = {};
    const state = undefined;
    expect(rootReducer(state, action)).toEqual(INITIAL_STATE);
  });

  describe('Handles CHANGE_PARAMETER action.', () => {
    test('Returns state with parameters set based on passed action.', () => {
      const action = {
        name: 'foo',
        type: CHANGE_PARAMETER,
        value: 'bar',
        view: 'baz',
      };
      const state = INITIAL_STATE;
      expect(rootReducer(state, action)).toEqual({
        ...state,
        views: {
          ...state.views,
          baz: {
            ...state.views.baz,
            parameters: {
              ...state.views.parameters.baz,
              foo: 'bar',
            },
          },
        },
      });
    });
  });

  describe('Handles DISMISS_ERROR action.', () => {
    test('Returns state with parameters set based on passed action.', () => {
      const action = {
        type: DISMISS_ERROR,
      };
      const state = {
        ...INITIAL_STATE,
        error: 'foo',
      };
      expect(rootReducer(state, action)).toEqual({
        ...state,
        error: null,
      });
    });
  });

  describe('Handles QUERY_RECORDS action.', () => {
    test('Returns state with isQuerying set to true.', () => {
      const action = {
        type: QUERY_RECORDS,
      };
      const state = {
        ...INITIAL_STATE,
        isQuerying: false,
      };
      expect(rootReducer(state, action)).toEqual({
        ...state,
        isQuerying: true,
      });
    });
  });

  describe('Handles RECEIVE_ERROR action.', () => {
    test('Returns state with error set based on passed action and isQuerying set to false.', () => {
      const action = {
        error: 'foo',
        type: RECEIVE_ERROR,
      };
      const state = {
        ...INITIAL_STATE,
        isQuerying: true,
      };
      expect(rootReducer(state, action)).toEqual({
        ...state,
        error: 'foo',
        isQuerying: false,
      });
    });
  });

  describe('Handles RECEIVE_RECORDS action.', () => {
    test('Returns state with records set based on passed action and isQuerying set to false.', () => {
      const action = {
        records: 'foo',
        type: RECEIVE_RECORDS,
        view: 'bar',
      };
      const state = {
        ...INITIAL_STATE,
        isQuerying: true,
      };
      expect(rootReducer(state, action)).toEqual({
        ...state,
        isQuerying: false,
        views: {
          ...state.views,
          bar: {
            ...state.views.bar,
            records: 'foo',
          },
        },
      });
    });
  });

  describe('Handles SORT_RECORDS action.', () => {
    const action = {
      sortBy: 'foo',
      type: SORT_RECORDS,
      view: 'bar',
    };
    test('Returns state with sortBy set based on passed action and sortDirection set to ASC when passed state sortBy differs with action sortBy.', () => {
      const state = {
        ...INITIAL_STATE,
        views: {
          bar: {
            sortBy: 'baz',
            sortDirection: 'ASC',
          },
        },
      };
      expect(rootReducer(state, action)).toEqual({
        ...state,
        views: {
          ...state.views,
          bar: {
            ...state.views.bar,
            sortBy: 'foo',
            sortDirection: 'ASC',
          },
        },
      });
    });

    test('Returns state with sortDirection set to DESC when passed state sortDirection is ASC and sortBy is the same as action sortBy', () => {
      const state = {
        ...INITIAL_STATE,
        views: {
          bar: {
            sortBy: 'foo',
            sortDirection: 'ASC',
          },
        },
      };
      expect(rootReducer(state, action)).toEqual({
        ...state,
        views: {
          ...state.views,
          bar: {
            ...state.views.bar,
            sortBy: 'foo',
            sortDirection: 'DESC',
          },
        },
      });
    });

    test('Returns state with sortDirection set to ASC when passed state sortDirection is DESC and sortBy is the same as action sortBy', () => {
      const state = {
        ...INITIAL_STATE,
        views: {
          bar: {
            sortBy: 'foo',
            sortDirection: 'DESC',
          },
        },
      };
      expect(rootReducer(state, action)).toEqual({
        ...state,
        views: {
          ...state.views,
          bar: {
            ...state.views.bar,
            sortBy: 'foo',
            sortDirection: 'ASC',
          },
        },
      });
    });
  });
});
