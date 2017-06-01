import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import {shallow, ShallowWrapper} from 'enzyme'
import {App} from '../App';
import {Provider} from 'react-redux';
import allReducers from '../reducers';
import {createStore, applyMiddleware} from 'redux';
jest.mock('react-dom');

function setup() {
  const props = {
    importantDateDefaultKey: 121,
    selectEvent: jest.fn()
  }

  const enzymeWrapper = shallow(<App {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

const store = createStore(
    allReducers
);

describe('application launch', () => {
  it('should render App', () => {
    const props = {importantDateDefaultKey: 121, selectEvent: jest.fn() }
    const tree = renderer.create(
        <Provider store= {store}>
          <App {...props}></App>
        </Provider>).toJSON();      
      expect(tree).toMatchSnapshot("Landing");   
  });
});

describe('validate basic structure', () => {
    it('should find core structure of html', () => {
      const {enzymeWrapper, props} = setup()                  
      expect(enzymeWrapper.find('.importantDates-webpart').length).toBe(1);    
      expect(enzymeWrapper.find('.importantDates-img').length).toBe(1);  
      expect(enzymeWrapper.find('.viewEvents').length).toBe(1);   
    });
});    
  


