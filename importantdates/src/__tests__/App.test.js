import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App from '../App';

describe('application launch', () => {
  it('should render App', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(component).toMatchSnapshot();
  });
});

/*
describe('check links', () => {
  it('should render App', () => {
    const tree = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
  });
});*/
