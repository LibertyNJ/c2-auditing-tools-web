import isQueryingReducer, { INITIAL_STATE } from './index';
import { QUERY_RECORDS, RECEIVE_ERROR, RECEIVE_RECORDS } from '../../actions/types';

describe('isQueryingReducer(state, action)', () => {
  test('Returns initial state.', () => {
    const action = {};
    const state = undefined;
    expect(isQueryingReducer(state, action)).toEqual(INITIAL_STATE);
  });

  test('Returns true on QUERY_RECORDS action.', () => {
    const action = {
      type: QUERY_RECORDS,
    };
    const state = false;
    expect(isQueryingReducer(state, action)).toBe(true);
  });

  test('Returns false on RECEIVE_ERROR action.', () => {
    const action = {
      error: 'foo',
      type: RECEIVE_ERROR,
    };
    const state = true;
    expect(isQueryingReducer(state, action)).toBe(false);
  });

  test('Returns false on RECEIVE_RECORDS action.', () => {
    const action = {
      records: 'foo',
      type: RECEIVE_RECORDS,
      view: 'bar',
    };
    const state = true;
    expect(isQueryingReducer(state, action)).toBe(false);
  });
});
