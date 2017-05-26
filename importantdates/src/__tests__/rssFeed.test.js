import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import App from '../App';



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

describe('#getListEvent() ', () => {
  it('should lfdafdaf',  () => {
    var eventItem = SelectListItem();
   
    //wexpect(eventItem).toBeDefined   
    //console.dir(data)
  })
})


