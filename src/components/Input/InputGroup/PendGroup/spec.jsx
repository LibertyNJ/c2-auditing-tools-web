'use-strict';

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';

import PendGroup from './index';

afterEach(cleanup);

describe('<PendGroup type={}>{children}</PendGroup>', () => {
  test('Renders passed children.', () => {
    const { queryByTestId } = render(
      <PendGroup type="append">
        <div data-testid="target" />
      </PendGroup>,
    );
    expect(queryByTestId('target')).toBeInTheDocument();
  });

  test('Handles type prop.', () => {
    const { queryByTestId } = render(
      <PendGroup data-testid="target" type="append">
        <div />
      </PendGroup>,
    );
    expect(queryByTestId('target')).toHaveClass('input-group-append');
  });
});
