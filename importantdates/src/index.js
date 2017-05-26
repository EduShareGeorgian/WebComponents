import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import allReducers from './reducers';
import {createStore, applyMiddleware} from 'redux';
//
const store = createStore(
    allReducers
);

ReactDOM.render(
    <Provider store= {store}>
        <App /> 
    </Provider>,
document.getElementById('root'));


