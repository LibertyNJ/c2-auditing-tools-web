import {
  changeParameter,
  dismissError,
  queryRecords,
  receiveError,
  receiveRecords,
  sortRecords,
} from './index';
import {
  CHANGE_PARAMETER,
  DISMISS_ERROR,
  QUERY_RECORDS,
  RECEIVE_ERROR,
  RECEIVE_RECORDS,
  SORT_RECORDS,
} from './types';

describe('changeParameter(view, name, value)', () => {
  test('Returns an object of type CHANGE_PARAMETER with correct properties.', () => {
    expect(changeParameter('foo', 'bar', 'baz')).toEqual({
      name: 'bar',
      type: CHANGE_PARAMETER,
      value: 'baz',
      view: 'foo',
    });
  });
});

describe('dismissError()', () => {
  test('Returns an object of type CHANGE_PARAMETER with correct properties.', () => {
    expect(dismissError()).toEqual({
      type: DISMISS_ERROR,
    });
  });
});

describe('queryRecords()', () => {
  test('Returns an object of type QUERY_RECORDS with correct properties.', () => {
    expect(queryRecords()).toEqual({
      type: QUERY_RECORDS,
    });
  });
});

describe('receiveRecords()', () => {
  test('Returns an object of type RECEIVE_RECORDS with correct properties.', () => {
    expect(receiveRecords('foo', 'bar')).toEqual({
      records: 'bar',
      type: RECEIVE_RECORDS,
      view: 'foo',
    });
  });
});

describe('receiveError(error)', () => {
  test('Returns an object of type RECEIVE_ERROR with correct properties.', () => {
    expect(receiveError('foo')).toEqual({
      error: 'foo',
      type: RECEIVE_ERROR,
    });
  });
});

describe('sortRecords(view, sortBy)', () => {
  test('Returns an object of type SORT_RECORDS with correct properties.', () => {
    expect(sortRecords('foo', 'bar')).toEqual({
      sortBy: 'bar',
      type: SORT_RECORDS,
      view: 'foo',
    });
  });
});
