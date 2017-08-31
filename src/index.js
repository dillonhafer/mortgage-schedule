import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/AppContainer';
import registerServiceWorker from './registerServiceWorker';
import './styles/css/index.css';

import { throttle } from 'lodash';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { loadState, saveState } from './PersistantState';
import reducers from './reducers';
const persistedState = loadState();
const store = createStore(reducers, persistedState);
store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
