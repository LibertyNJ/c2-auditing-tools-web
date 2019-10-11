'use-strict';

import {
  changeField, queryData, receiveData, receiveError, sortRecords,
} from './index';
import {
  CHANGE_FIELD, QUERY_DATA, RECEIVE_DATA, RECEIVE_ERROR, SORT_RECORDS,
} from './types';

describe('changeField()', () => {
  test('Returns an object of type CHANGE_FIELD with correct properties.', () => {
    expect(changeField('foo', 'bar', 'baz')).toEqual({
      name: 'bar',
      type: CHANGE_FIELD,
      value: 'baz',
      view: 'foo',
    });
  });
});

describe('queryData()', () => {
  test('Returns an object of type QUERY_DATA with correct properties.', () => {
    expect(queryData()).toEqual({
      type: QUERY_DATA,
    });
  });
});

describe('receiveData()', () => {
  test('Returns an object of type RECEIVE_DATA with correct properties.', () => {
    expect(receiveData('foo', 'bar')).toEqual({
      data: 'bar',
      type: RECEIVE_DATA,
      view: 'foo',
    });
  });
});

describe('receiveError()', () => {
  test('Returns an object of type RECEIVE_ERROR with correct properties.', () => {
    expect(receiveError('foo')).toEqual({
      error: 'foo',
      type: RECEIVE_ERROR,
    });
  });
});

describe('sortRecords()', () => {
  test('Returns an object of type SORT_RECORDS with correct properties.', () => {
    expect(sortRecords('foo', 'bar')).toEqual({
      column: 'bar',
      type: SORT_RECORDS,
      view: 'foo',
    });
  });
});
