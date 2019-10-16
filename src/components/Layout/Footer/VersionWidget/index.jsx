'use-strict';

import React from 'react';

import { version } from '../../../../../package.json';

export default function VersionWidget({ ...restProps }) {
  return <div {...restProps}>Version: {version}</div>;
}
