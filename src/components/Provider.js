import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider ,connect} from 'react-redux';
import LocaleProvider from './LocaleProvider';
import reducer ,{getStatus,getReady,getOnline} from './reducers/index'
import Root from './Root';
import * as actions  from './actions/index';

import {
    HashRouter as Router,
    Route

} from 'react-router-dom'

let store;
if(process.env.IOT_PLATFORM === 'dna'){
    let createSagaMiddleware = require('redux-saga').default;
    let rootSaga = require('./saga').default;
    let sagaMiddleware = createSagaMiddleware();
    store =  createStore(reducer,applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
}else{
    store =  createStore(reducer);
}

const AutoUpdateRoot= connect(
    (state, props) => {
        const status = getStatus(state);
        const online = getOnline(state);
        const isStatusReady = (online === '1' || online === '2') ?
            (status && Object.keys(status).length>0):
            (online === '0' || online === '3');
        return {
            isReady: getReady(state),
            isLoading: state.loading,
            isStatusReady,
            isOnline: online === '1' || online === '2'
        };
    },
    actions
)(Root);


export default ({children,settings})=>(
    <Provider  store={store}>
        <LocaleProvider>
            <Router>
                <Route render={(props)=>
                    <AutoUpdateRoot {...props} settings={settings}>
                        {children}
                    </AutoUpdateRoot>
                }/>
            </Router>

        </LocaleProvider>
    </Provider>
)
