import $ from 'jquery'
import xml2json from 'xml2js';
var xml2js = require('xml2js');
var parser = new xml2js.Parser({ignoreAttrs : false,explicitArray : false, attrkey:  '@', xmlns: false, tagNameProcessors: [xml2js.processors.stripPrefix]});
 

class CurrentEventApi {
    static fetchCurrentEvent(key) {
    var items;
    var events =[];
    var promise = new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:3001/rss.xml',
            dataType: 'XML'})
            .done(data => {
            var events = [];
            var xmlText = data; // XML
            parser.parseString(data.documentElement.outerHTML,function (err, result) {
                if(err){            
                    reject(events)
                }
                else{
                    items = result.rss.channel.item;
                        $.each(items, function( index, item ) {
                        events.push({"description":item.title, "date": item.pubDate})
                    });
                    resolve(events)
                }
            })
        })
       })
        return promise  
    }}
    export default CurrentEventApi



