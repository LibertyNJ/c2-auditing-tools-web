import Table from './index';

describe('Table.isInAlphabeticalOrder', () => {
  test('returns true when argument 1 is lexicographically less than argument 2', () => {
    expect(Table.isInAlphabeticalOrder('a', 'b')).toBe(true);
  });

  test('returns false when argument 1 is lexicographically greater than argument 2', () => {
    expect(Table.isInAlphabeticalOrder('b', 'a')).toBe(false);
  });

  test('logic holds regardless of argument case', () => {
    expect(Table.isInAlphabeticalOrder('a', 'B')).toBe(true);
  });
});
