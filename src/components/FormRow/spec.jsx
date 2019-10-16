'use-strict';

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';

import FormRow, { BASE_CLASS_NAME } from './index';

afterEach(cleanup);

describe('<FormRow>{children}</FormRow>', () => {
  test('Renders passed children.', () => {
    const { queryByTestId } = render(
      <FormRow>
        <div data-testid="target" />
      </FormRow>,
    );
    expect(queryByTestId('target')).toBeInTheDocument();
  });

  test('Handles className prop.', () => {
    const testClass = 'foo';
    const { queryByTestId } = render(
      <FormRow data-testid="target" className={testClass}>
        <div />
      </FormRow>,
    );
    expect(queryByTestId('target')).toHaveClass(BASE_CLASS_NAME, testClass);
  });
});
