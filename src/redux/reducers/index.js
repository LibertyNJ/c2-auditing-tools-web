import { combineReducers } from 'redux';

import error from './error';
import isQuerying from './is-querying';
import views from './views';

export default combineReducers({ error, isQuerying, views });
