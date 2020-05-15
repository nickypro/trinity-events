const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
url: `http://trinitysocieties.ie/society-search-result/`,
json: false
}

const getSocieties = () => {
  console.log("----- Getting Societies -----")
  return rp(options)
  .then(data => {
    //console.log(data);
    var $ = cheerio.load(data);
    
    //Class for old events in old format = $('td div.bf')
    //Class for new events in old format = $('td div.bp')
    
    const societyData = $('h2 a')
    const societies = []
    
    for (i in societyData) {
      if (societyData[i].attribs && societyData[i].attribs.href && societyData[i].children && societyData[i].children[0])
        societies.push({
          "name": societyData[i].children[0].data,
          "url": societyData[i].attribs.href,
          "id": societyData[i].attribs.href.split("?socid=")[1]
        })
    }
    
    console.log("----- Got Societies :) -----")
    return societies
  })
}

module.exports = getSocieties