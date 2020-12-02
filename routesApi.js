
const scrapeEvents = require('./functions/scrapeEvents')
const sendEventData = require('./apis/sendEventData')

const todayStringYMD = require('./functions/todayStringYMD')

const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

const routesApi = (app, connection, societies, eventsFromToday, log = ()=>{}) => {

  (async () => {
    await scrapeAndUpdate(connection, societies) 
    getEventsFromMySQL(connection, todayStringYMD(), (eventsRecieved) => {
      eventsFromToday = eventsRecieved
    })
  })()

  //run the scraping every hour
  setInterval(async () => {
    await scrapeAndUpdate(connection, societies) 
    getEventsFromMySQL(connection, todayStringYMD(), (eventsRecieved) => {
      eventsFromToday = eventsRecieved
    })
  }, 1*hour)

  //send event data
  app.get('/api/eventdata', async (req, res) => {
  try {
    console.log(" - sending event data")
    log(" - sending event data")
    sendEventData(req, res, connection, eventsFromToday, todayStringYMD, log)
    
  } catch (err) {
    console.log(" - Error with GET societies : ", err.message)
    log(" - Error with GET societies : ", err.message)
    res.status("400")
  }
  });
  
  //send society info 
  app.get('/api/societies', (req, res) => {
    console.log(` - sent ${societies.length} societies`)
    log(` - sent ${societies.length} societies`)
    res.json(societies)
  })
  
  app.get('/api/scrape/:apikey/:facebook', async (req, res) => {
    const scraperApiKey = req.params.apikey;
    const facebookHandle = req.params.facebook;
    console.log(` - scraping custom events page from ${facebookHandle} using ${scraperApiKey}`)
    log(` - scraping custom events page from ${facebookHandle} using ${scraperApiKey}`)
    scrapeEvents({scraperApiKey, facebookHandle}, res)
  })
  
  app.get('/api/pages', async (req, res) => {
    try {
    fetch(`${process.env.STRAPI_URL || "http://localhost:1337"}/pages`)
      .then(pages => pages.json())
      .then(json => res.json(json))
      .then(console.log(" - sent pages"))
    } catch (err) {
      console.log(" - ERROR could not send pages, ", err.message)
      log(" - ERROR could not send pages, ", err.message)
    }
  }) 

}

module.exports = routesApi;
