// Importing this component into the top of the project makes bootstrap-select
// compatible with react-router-dom. Bootstrap-select's class implementation
// only auto-initializes on page load. Switching routes causes problems.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import $ from 'jquery';
import 'bootstrap-select';

$.fn.selectpicker.Constructor.BootstrapVersion = '4';

export default function BootstrapSelectReactRouterDomSupport() {
  const location = useLocation();
  useEffect(initializeBootstrapSelect, [location]);
  return null;
}

function initializeBootstrapSelect() {
  $('.selectpicker').selectpicker();
}
