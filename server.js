require('dotenv').config()
const express = require('express')
const path = require('path');
const app = express();
const dateFormat = require('dateformat');

const https = require('https');
const fs = require('fs');

const mysql = require('mysql')
const creds = require('./mysql-credentials.json')

const scrapeEvents = require('./functions/scrapeEvents')
const scrapeAndUpdate = require('./functions/scrapeAndUpdateEvents')
const getEventsFromMySQL = require('./functions/getEventsFromMySQL')

//working memory data
const societies = []
let eventsFromToday = []

const hour = 3600000

//used functions
const todayStringYMD = () => dateFormat(new Date(), "yyyy-mm-dd") 
function doIntersect(shortArr, longArr) {
  var setA = new Set(shortArr);
  var setB = new Set(longArr);
  const ans = [...setA].filter(x => setB.has(x))
  return !( ans.length == 0 );
}

const connection = mysql.createConnection(creds)

//get all the societies from the database
connection.connect(async (err) => {  
  if (err) return console.error('error: ' + err.message);
  
  connection.query("SELECT * FROM societies", (err, results, fields) => {
    if (err) console.error(err.message);
    else {
      // sort societies by alphabetical order
      results.sort((soc1, soc2) => {
        if (soc1.name < soc2.name) return -1
        if (soc1.name > soc2.name) return 1
        return 0
      })
      // save societies to working memory
      .forEach( (soc, index) => { 
        societies.push(soc)
      }) 

      console.log(" - Got list of societies")
      //scrapeAndUpdate(connection, societies)

      getEventsFromMySQL(connection, todayStringYMD(), (eventsRecieved) => {
        eventsFromToday = eventsRecieved
      })

    }
  });
});

//run the scraping every hour
setInterval(async () => {
  await scrapeAndUpdate(connection, societies) 
  getEventsFromMySQL(connection, todayStringYMD(), (eventsRecieved) => {
    eventsFromToday = eventsRecieved
  })
}, 1*hour)
  
//app
app.use(express.static(path.join(__dirname, 'build')));

//Logger
const logger = (req, res, next) => {
  console.log(`${new Date().toUTCString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
}
app.use(logger)

//send event data
app.get('/api/eventdata', async (req, res) => {
  console.log(" - sending event data")
  const startDate = (req.query.date.match(/\d{4}-\d{2}-\d{2}/)) ? req.query.date : todayStringYMD()
  
  let selected = []
  if (req.query.socs) selected = await JSON.parse(req.query.socs)
  if (selected.length == 0 | !Array.isArray(selected)) {
    console.log(" - selected societies has length zero - sending for all societies")
    selected == []
  }

  if (startDate === todayStringYMD()) {
    if (selected.length == 0) {
      console.log(` - sending ${eventsFromToday.length} default events starting from today`)
      res.json(eventsFromToday);
    } else {
      console.log(` - sending filtered events starting from today`)
      selectedIds = new Set(selected)
      res.json(eventsFromToday.filter( event => doIntersect(event.societyIds, selected) ))
    }
  } else {
    console.log(` - performing manual database search for ${startDate}`)
    getEventsFromMySQL(connection, startDate, (eventsRecieved) => {
      res.json(eventsRecieved)
    }, selected)
  }
});

//send society info 
app.get('/api/societies', (req, res) => {
  console.log(` - sent ${societies.length} societies`)
  res.json(societies)
})

app.get('/api/scrape/:apikey/:facebook', async (req, res) => {
  const scraperApiKey = req.params.apikey;
  const facebookHandle = req.params.facebook;
  console.log(` - scraping custom events page from ${facebookHandle} using ${scraperApiKey}`)
  const ans = await scrapeEvents({scraperApiKey, facebookHandle}, res)
})

//send react app
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/:page', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 80, () => {
  console.log(`HTTP  Listening on port ${process.env.PORT || 8080}`)
});

// we will pass our 'app' to 'https' server
try {
  https.createServer({
    key: fs.readFileSync(process.env.PRIVATE_SSL_KEY || './key.pem'),
    cert: fs.readFileSync(process.env.SSL_CERTIFICATE || '/cert.pem'),
  }, app)
  .listen(process.env.SSL_PORT || 443, () => {
    console.log(`HTTPS Listening on port ${process.env.SSL_PORT || 443}`)
  });
} catch (err) {
  console.log("SSL server initialization failed : ", err.message)
}