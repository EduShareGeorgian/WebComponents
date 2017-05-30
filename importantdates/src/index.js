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


const middleware = [ thunk, logger ]
const store = createStore(
    allReducers,
    applyMiddleware(...middleware)
);
ReactDOM.render(
    <Provider store= {store}>
        <App /> 
    </Provider>,
document.getElementById('root'));








