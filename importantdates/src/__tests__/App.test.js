import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App from '../App';
import {Provider} from 'react-redux';
import allReducers from '../reducers';
import {createStore, applyMiddleware} from 'redux';
jest.mock('react-dom');
const store = createStore(
    allReducers
);

describe('application launch', () => {
  it('should render App', () => {
    const component = ReactDOM.render(
    <Provider store= {store}>
        <App />      
        const tree = component.toJSON();      
        expect(component).toMatchSnapshot(); 
    </Provider>);   
      
  });
});



