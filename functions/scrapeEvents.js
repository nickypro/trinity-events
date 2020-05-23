const rp = require('request-promise');
const cheerio = require('cheerio');

const hour = 3600000
const maxTimeForward = 6*30*24*hour //6 months

/* cut string */
function cut(str, from, to) {
  if (from == -1) 
    return str;
  return str.slice(0, from) + str.slice(from+to)
}

function eventScraper({scraperApiKey, facebookHandle}, response=()=>{}) {
  
  console.log("----- scraping events -----")
  const options = {
    url: `http://api.scraperapi.com?api_key=${scraperApiKey}&url=https://m.facebook.com/pg/${facebookHandle}/events%3flang%3den"`,
    json: false
  }
  
  return rp(options)
  .then(data => {
    //console.log(data);
    var $ = cheerio.load(data);
    
    //Class for old events in old format = $('td div.bf')
    //Class for new events in old format = $('td div.bp')
    const eventsOld = $('td div.bp')
    const eventsNew = $('._2x2s')

    //let us know when events are loaded
    console.log(`-----  events loaded  -----`)
    if (eventsOld.length > 0) console.log("----- Old format page -----")
    if (eventsNew.length > 0) console.log("----- New format page -----")
    

    //Create an array in which to store events.
    const listOfEvents = []


    //Extract Data from Old Events Page
    //@todo : TEST MORE AND FIX WHEN THERE ARE NO EVENTS
    for(let i = 0; i < eventsOld.length; ++i) {
      //console.log(`\n item ${i} : \n`)
      const event = eventsOld[new String(i)].children[0].children

      //get the time
      let time = event[0].children[0].data;
      //console.log(time, "from ", eventsOld.html() )
      time = cut(time, time.indexOf("–"), 10)
      time = cut(time, time.indexOf("at"), 3)

      //get the location
      let location;
      location = event[1].children[0]
      location = (location)? location.children[0].children[0].data : "Unknown Location";
      
      //get the event page info
      let link, title, regex, href, id; 
        link  = event[2].children[0].children[0]
        title = link.attribs['aria-label'].slice(23)
        regex = /events\/\d+/
        href  = link.attribs.href.match(regex)[0]
        id   = href.match(/\d+/)[0]

        
      //package the event into an object
      const e = {
        id,
        title,
        date: new Date(time),
        location,
        url: `https://www.facebook.com/events/${id}`
      }

      console.log(i, e.title, e.date)
      listOfEvents.push(e)
    }
    

    
    //Extract Data from New events page
    for(let i = 0; i < eventsNew.length; ++i) {
      //console.log(`\n item ${i} : \n`)
      //console.log($.html())

      const event =  eventsNew[new String(i)].children[0].children
      const title =  event[0].children[0].data;
      const dateArr = event[1].children[0].children;  
      const dayMonth = dateArr[1].children[0].data+' '+dateArr[0].children[0].data;
      let time =   event[2].children[0].children[0].children[0].data;
      let   location=event[3].children[0].children[0];
      location = (location) ? location.data : "Unknown Location"
      const regex = /events\/\d+/
      const href = event[event.length-1].attribs.href.match(regex)[0];
      const id = href.match(/\d+/)[0]
      
      //format time to work if like "8 PM" instead of "8:00 PM" 
      if (time.length === 4)
      time = time.slice(0, 1) + ":00" + time.slice(1)
      if (time.length === 5)
      time = time.slice(0, 2) + ":00" + time.slice(2)

      //in new events format, the year is not included, so we guess
      const yr = new Date().getUTCFullYear();
      let date = new Date(yr+" "+dayMonth+" "+time)
      if (date.getMonth() < 3 && new Date().getMonth >= 9)
        date = new Date(`${yr+1} ${dayMonth} ${time}`)
      if (Number(date) - Number(new Date()) > maxTimeForward)
        date = new Date(`${yr-1} ${dayMonth} ${time}`)

      //package the event into an object
      const e = {
        title,
        date: date.toISOString().slice(0, 19).replace('T', ' '),
        location,
        id,
        url: `https://www.facebook.com/events/${id}`
      }
      
      console.log(i, e.title, e.date);
      listOfEvents.push(e)
    } 
    
    
    
    //return the scraped events
    console.log("------ End ------")
    if (response.json) response.json(listOfEvents)
    
    return listOfEvents 
  })
	.catch((err) => {
    console.log(" - ERROR scraping: ", err.message)
    if(response.send) response.send(`Error Scraping for ${facebookHandle}, check it is valid`)
    return null
  });
}

module.exports = eventScraper;
