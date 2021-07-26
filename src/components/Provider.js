/*
 * @Author: your name
 * @Date: 2021-07-12 14:38:33
 * @LastEditTime: 2021-07-26 10:30:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\components\Provider.js
 */
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import LocaleProvider from './LocaleProvider';
import reducer, { getReady } from './reducers/index';
import Root from './Root';
import * as actions from './actions/index';

import { HashRouter as Router, Route } from 'react-router-dom';

let store;
if (process.env.IOT_PLATFORM === 'dna') {
  let createSagaMiddleware = require('redux-saga').default;
  let rootSaga = require('./saga').default;
  let sagaMiddleware = createSagaMiddleware();
  store = createStore(reducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);
} else {
  store = createStore(reducer);
}

const AutoUpdateRoot = connect((state, props) => {
  // const status = getStatus(state);
  return {
    isReady: getReady(state),
    isLoading: state.loading,
  };
}, actions)(Root);

export default ({ children, settings }) => (
  <Provider store={store}>
    <LocaleProvider>
      <Router>
        <Route
          render={(props) => (
            <AutoUpdateRoot {...props} settings={settings}>
              {children}
            </AutoUpdateRoot>
          )}
        />
      </Router>
    </LocaleProvider>
  </Provider>
);
