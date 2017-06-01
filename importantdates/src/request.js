const fs = require('fs')
var inspect = require('util-inspect');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({ignoreAttrs : false,explicitArray : false, attrkey:  '@', xmlns: false, tagNameProcessors: [xml2js.processors.stripPrefix]});
 
const request = (url) => new Promise((resolve, reject) => { 
  // Load rss xml data from a file in the subfolder for mock data  
  const lastSlash = url.lastIndexOf('/') 
const rssFile = url.substring(lastSlash + 1);
console.log(url);
  fs.readFile(`./src/rss/__mockData__/${rssFile}.xml`, 'utf8', (err, data) => {
    if (err) reject(err)   
    parser.parseString(data,function (err, result) {
        if(err){            
            console.log('error');
        }
        else{
            console.log('the result ' + result);
        }
         resolve({ entity: JSON.stringify(result) });
    });       
  })
})

export default request