
import CurrentEventApi from '../api/selectEventApi'
import jquery from 'jquery'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
var xml2js = require('xml2js');

const moment = require('moment');
var parser = new xml2js.Parser({ignoreAttrs : false,explicitArray : false, attrkey:  '@', xmlns: false, tagNameProcessors: [xml2js.processors.stripPrefix]});
var dates

export const selectEvent = event => (dispatch, getState) => {
    return dispatch(fetchPosts(event))
}
export const receivePosts = (event, data) => (
    {
      type: 'RECEIVE_POSTS',
      event,
      payload: data
    }
)

const fetchPosts = event => dispatch => {
  var events = []
  return fetch(`http://localhost:3000/rss.xml`)
    .then(response => response.text())
    .then(xmlString => jquery.parseXML(xmlString))
    .then(data => {
        parser.parseString(data.documentElement.outerHTML,function (err, result) {
        if(err){            
           
        }
        else{
            var items = result.rss.channel.item;
            jquery.each(items, function( index, item ) {
                var a = moment(item.pubDate); 
                events.push({"description":item.title, "date": a.format('l')})
            });
        }
            dispatch(receivePosts(event, events))
      })
  })
}
