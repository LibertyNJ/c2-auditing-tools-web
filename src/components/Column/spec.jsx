'use-strict';

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';

import Column from './index';

afterEach(cleanup);

describe('<Column />', () => {
  test('Renders passed children.', () => {
    const { queryByTestId } = render(
      <Column>
        <div data-testid="child" />
      </Column>,
    );
    expect(queryByTestId('child')).toBeInTheDocument();
  });

  test('Has class "col" when not passed a span prop.', () => {
    const { queryByTestId } = render(
      <Column data-testid="target">
        <div />
      </Column>,
    );
    expect(queryByTestId('target')).toHaveClass('col');
  });

  test('Handles span prop.', () => {
    const { queryByTestId } = render(
      <Column data-testid="target" span={6}>
        <div />
      </Column>,
    );
    expect(queryByTestId('target')).toHaveClass('col-6');
  });
});
