import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {App} from '../App';
import { shallow, mount, render } from 'enzyme';
import renderer from "react-test-renderer"


describe('<App />', () => {
  it('should match the snapshot', () => {
   // const tree = renderer.create(
   //       <App></App>
    //  ).toJSON();
    const wrapper = shallow(<App />);
   // expect(wrapper.getNodes()).toMatchSnapshot();
  });
});

const rssFeed = require('../rss/getrssfeed')
describe('#getRssFeed() using async/await', () => {
  it('should load rss data', async () => {
    const data = await rssFeed.getRssFeed('rssFile')
    expect(data).toBeDefined()    
    //console.dir(data)
  })
})

describe('#getRssFeedFail() using async/await', () => {
  it('should load rss data', async () => {
    const data = await rssFeed.getRssFeed('rssFile')
    expect(data).toBeDefined   
    //console.dir(data)
  })
})



