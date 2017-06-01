import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import allReducers from './reducers';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { updateLanguage } from 'react-localize-redux';
import { setGlobalTranslations } from 'react-localize-redux';
 
const middleware = [ thunk, logger ]
const store = createStore(
    allReducers,
    applyMiddleware(...middleware)
);
const json = require("./global.locale.json");
store.dispatch(updateLanguage('en'));
store.dispatch(setGlobalTranslations(json));
ReactDOM.render(
    <Provider store= {store}>
        <App /> 
    </Provider>,
document.getElementById('root'));








