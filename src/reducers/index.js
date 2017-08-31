import { combineReducers } from 'redux';

import appState from './AppState';

const appReducers = combineReducers({
  appState,
});

export default appReducers;
