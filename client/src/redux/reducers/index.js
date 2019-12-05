import { combineReducers } from 'redux';

import databaseStatus from './database-status';
import error from './error';
import forms from './forms';
import tables from './tables';

export default combineReducers({
  databaseStatus,
  error,
  forms,
  tables,
});
