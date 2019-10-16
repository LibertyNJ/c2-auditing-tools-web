'use-strict';

import { reduceClassNames } from './index';

describe('reduceClassNames(...classNames)', () => {
  test('Returns a concatenated string of passed classNames separated by spaces when passed multiple className strings.', () => {
    expect(reduceClassNames('foo bar', 'baz', 'bat zee zim')).toBe('foo bar baz bat zee zim');
  });

  test('Returns passed className string when passed a single className string.', () => {
    expect(reduceClassNames('foo bar baz')).toBe('foo bar baz');
  });
});
