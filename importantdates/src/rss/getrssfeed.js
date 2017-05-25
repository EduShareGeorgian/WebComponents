import request from '../request'

//const getRssFeed = rssFeed => request(`http://www.georgiancollege.ca/news-events/events/categories/important-dates/286/feed/`)
const getRssFeed = rssFeed => request('rss')
export { getRssFeed }