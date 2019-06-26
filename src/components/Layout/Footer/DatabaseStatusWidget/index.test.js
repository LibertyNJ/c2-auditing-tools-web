import { getDatabaseStatusTextColorClass } from './index';

describe('getDatbaseStatusTextColorClass', () => {
  test("returns 'text-success' when passed 'Ready'", () => {
    expect(getDatabaseStatusTextColorClass('Ready')).toBe('text-success');
  });

  test("returns 'text-danger' when passed 'Error'", () => {
    expect(getDatabaseStatusTextColorClass('Error')).toBe('text-danger');
  });

  test("returns 'text-danger' when passed 'Unknown'", () => {
    expect(getDatabaseStatusTextColorClass('Unknown')).toBe('text-danger');
  });

  test("returns 'text-warning' when passed anything else", () => {
    expect(getDatabaseStatusTextColorClass('foo')).toBe('text-warning');
  });
});
