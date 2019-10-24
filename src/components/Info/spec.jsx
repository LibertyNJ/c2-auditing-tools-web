import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';

import Info from './index';

afterEach(cleanup);

describe('<Info>{children}</Info>', () => {
  test('Renders passed children.', () => {
    const { queryByText } = render(<Info>foo</Info>);
    expect(queryByText('foo')).toBeInTheDocument();
  });
});
