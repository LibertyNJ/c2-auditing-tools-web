import Form from './Form';

describe('Form.isSelectElement', () => {
  test("returns true when passed an object with tagName property that has value 'SELECT'", () => {
    const element = { tagName: 'SELECT' };
    expect(Form.isSelectElement(element)).toBe(true);
  });

  test("returns false when passed an object with tagName property that does not have value 'SELECT'", () => {
    const element = { tagName: 'INPUT' };
    expect(Form.isSelectElement(element)).toBe(false);
  });
});

describe('Form.getSelectedOptionValues', () => {
  test('returns array of selected options when passed a reference to a select element', () => {
    const selectElement = { selectedOptions: [{ value: 'foo' }, { value: 'bar' }] };
    expect(Form.getSelectedOptionValues(selectElement)).toEqual(['foo', 'bar']);
  });
});
