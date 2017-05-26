import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {App} from '../App';
import { shallow, mount, render } from 'enzyme';


describe('<App />', () => {
  it('should render the component', () => {
    const wrapper = shallow(<App />);   
    /*expect(wrapper.find('div.App').children()).toHaveLength(1);  

    const dropdownelement = wrapper.find('Dropdown')
    const t1 = expect(dropdownelement.nodes);
    t1.toHaveLength(1);*/
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



