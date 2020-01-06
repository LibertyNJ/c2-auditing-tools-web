import { combineReducers } from 'redux';

import error from './error';
import forms from './forms';
import tables from './tables';

export default combineReducers({
  error,
  forms,
  tables,
});
