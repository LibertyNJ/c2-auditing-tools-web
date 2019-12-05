import errorReducer, { INITIAL_STATE } from './index';
import { DISMISS_ERROR, RECEIVE_ERROR } from '../../actions/types';

describe('errorReducer(state, action)', () => {
  test('Returns initial state.', () => {
    const action = {};
    const state = undefined;
    expect(errorReducer(state, action)).toEqual(INITIAL_STATE);
  });

  test('Returns null on DISMISS_ERROR action.', () => {
    const action = {
      type: DISMISS_ERROR,
    };
    const state = 'foo';
    expect(errorReducer(state, action)).toBeNull();
  });

  test('Returns received error on RECEIVE_ERROR action.', () => {
    const action = {
      error: 'foo',
      type: RECEIVE_ERROR,
    };
    const state = null;
    expect(errorReducer(state, action)).toBe(action.error);
  });
});
