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