const rp = require('request-promise');
const cheerio = require('cheerio');

const def = { 
  name: 'Q Soc - Trinity LGBT',
  url: 'http://trinitysocieties.ie/society/?socid=91',
  id: '91' 
}

const getSocietyInfo = ({id, name, url} = def) => {
  return rp({url, json:false})
  .then(data => {
    if (!data) return console.log("no data")

    var $ = cheerio.load(data);
    
    const links = $('h2:contains("Social Media")')[0].next.children

    var website = $('[src="http://trinitysocieties.ie/wp-content/uploads/2016/08/website-1.png"]')[0]
    website = website ? website.parent.attribs.href : ""

    var about = $('main div p')[0].children[0]
    about = about ? about.data : ""

    //console.log(about)

    const info = {id, name, about, url, website}

    for (i in links) {
      let data =  (links[i].attribs) ? links[i].attribs.href : ""
    
      if (data) {
        if ( data.match("mailto")    ) info.email = data.replace("mailto:", "")
        if ( data.match("pdf")       ) info.constitution = data
        if ( data.match("twitter")   ) info.twitter = data
        if ( data.match("instagram") ) info.instagram = data
        if ( data.match("snapchat")  ) info.snapchat = data
        if ( data.match("facebook")  ) {
          info.facebook = data
          info.facebookHandle = data.split(/\/+/ig)[2]
        }
      }
    }

    return info
  })
}

module.exports = getSocietyInfo