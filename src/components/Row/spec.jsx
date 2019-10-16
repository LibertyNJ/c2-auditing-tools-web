'use-strict';

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';

import Row, { BASE_CLASS_NAME } from './index';

afterEach(cleanup);

describe('<Row>{children}</Row>', () => {
  test('Renders passed children.', () => {
    const { queryByTestId } = render(
      <Row>
        <div data-testid="target" />
      </Row>,
    );
    expect(queryByTestId('target')).toBeInTheDocument();
  });

  test('Handles className prop.', () => {
    const testClass = 'foo';
    const { queryByTestId } = render(
      <Row data-testid="target" className={testClass}>
        <div />
      </Row>,
    );
    expect(queryByTestId('target')).toHaveClass(BASE_CLASS_NAME, testClass);
  });
});
