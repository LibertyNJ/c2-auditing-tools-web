import { getFormControlComponent } from './index';

describe('getFormControlComponent', () => {
  test('throws error when default case', () => {
    expect(() => getFormControlComponent('foo')).toThrow("Invalid form control type: 'foo'");
  });
});
