import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';

import InputGroup from './index';

afterEach(cleanup);

describe('<InputGroup append={} name={} prepend={} type={} />', () => {
  test('Appends component passed in append prop.', () => {
    const appendElement = <div>Append</div>;
    const { container } = render(<InputGroup append={appendElement} name="foo" type="text" />);
    expect(container).toContainHTML('<div>Append</div>');
  });

  test('Changes form control HTML tag to "textarea" if passed "textarea" in type prop.', () => {
    const { container } = render(<InputGroup name="foo" type="textarea" />);
    expect(container).toContainHTML('<textarea');
  });

  test('Prepends component passed in prepend prop.', () => {
    const prependElement = <div>Prepend</div>;
    const { container } = render(<InputGroup name="foo" prepend={prependElement} type="text" />);
    expect(container).toContainHTML('<div>Prepend</div>');
  });
});
