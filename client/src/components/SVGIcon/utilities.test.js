'use-strict';

import { getViewBox, getD } from './utilities';

describe('getViewBox', () => {
  test("returns '0 0 32 32' when passed a default case", () => {
    expect(getViewBox('foo')).toBe('0 0 32 32');
  });
});

describe('getD', () => {
  test("throws 'Invalid SVGIcon type' error message when passed invalid SVGIcon type", () => {
    expect(() => getD('foo')).toThrow("Invalid SVGIcon type: 'foo'");
  });
});