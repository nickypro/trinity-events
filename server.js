const express = require('express')
const path = require('path');
const app = express();
const dateFormat = require('dateformat');

const mysql = require('mysql')
const creds = require('./mysql-credentials.json')
const apiKeys = require('./scraperApiKeys.js')

const scrapeEvents = require('./functions/scrapeEvents')

//get society info
const connection = mysql.createConnection(creds)
const societies = []
const listOfSocIds = []
const SocIdToIndex = {}

const hour = 3600000
const delay = 24*hour
const randomInt = (max) => Math.floor(max * Math.random()) 

//get all the societies from the database
connection.connect(async (err) => {  
  if (err) return console.error('error: ' + err.message);
  
  connection.query("SELECT * FROM societies", (err, results, fields) => {
    if (err) console.error(err.message);
    else {
      // sort events by alphabetical order
      results.sort((soc1, soc2) => {
        if (soc1.name < soc2.name) return -1
        if (soc1.name > soc2.name) return 1
        return 0
      })
      // get all the ids of the societies
      .forEach( (soc, index) => { 
        societies.push(soc)
        listOfSocIds.push(soc.id) 
        SocIdToIndex[soc.id] = index 
      }) 

      console.log("Got list of societies")
      scrapeAndUpdate()
    }
  });
});

async function scrapeAndUpdate() {
  console.log(`scraping events for ${listOfSocIds.length} societies`)

  for (i in societies) {
    const soc = societies[i]
    
    // do not scrape if there is no facebook to scrape, or if scraped recently
    if (!soc.facebookHandle) continue
    if ( Number(new Date()) - Number(new Date(soc.lastScraped)) < delay ) continue
    console.log(`scraping events for ${soc.name}`)

    // physoc api key
    //"5dd2529775fd69daba1371fe479567d3",

    //scrape using a random api key
    const scrapeOptions = { 
      scraperApiKey: apiKeys[randomInt(apiKeys.length)], 
      facebookHandle: (soc.facebookHandle)
    }
    const events = await scrapeEvents(scrapeOptions)

    //ensure results were successful
    if (!events) continue
    console.log(`${events.length} events scraped for ${soc.name} \n`)

    //if so, make MySQL friendly array of values
    const insertToEvents = []
    const insertToJoin = []
    for (i in events) {
      e = events[i]
      insertToEvents.push([e.id, e.url, e.title, e.date, e.location])
      insertToJoin.push([soc.id, e.id])
    }
    
    //update "lastScraped" so only scraped once a day
    connection.query(`
      UPDATE societies 
        SET lastScraped = ?
      WHERE 
        id = ${soc.id};
    `, [new Date()], (err, results, fields) => {
      if (err) console.error(`error updating last-scraped time for ${soc.name}:  ${err.message}`);
    });
     
    //update the events
    connection.query(`
      INSERT INTO events 
        (id, url, title, date, location) 
      VALUES ?
      ON DUPLICATE KEY UPDATE
        url      = VALUES (url), 
        title    = VALUES (title), 
        date     = IF( date < NOW() - INTERVAL 90 DAY, date, VALUES (date) ),
        location = VALUES (location);
        `, [insertToEvents], (err, results, fields) => {
      if (err) console.error(`error in events for ${soc.name}:  ${err.message}`);
    });

    //update the join table with those events
    connection.query(`
      INSERT IGNORE INTO society_event 
        (society_id, event_id)
      VALUES ?;`, [insertToJoin], (err, results, fields) => {
      if (err) console.log(`error in join for ${soc.name}: `, err.message)
    })

  }
}

//run the scraping every hour
setInterval( scrapeAndUpdate , 1*hour)
  
//app
app.use(express.static(path.join(__dirname, 'build')));

//send event data
app.get('/api/eventdata', async (req, res) => {
  console.log("sending event data")
  
  let selected = []
  if (req.query.socs) selected = await JSON.parse(req.query.socs)
  if (selected.length === 0) {
    console.log("selected has length zero")
    selected = listOfSocIds
  }

  const startDate = (req.query.date) ? req.query.date : dateFormat(new Date(), "yyyy-mm-dd") 

  //console.log(listOfSocIds)
  //console.log(selected, selected.length)
  //await getEvents(selected, res)

  connection.query(`
    SELECT
      e.*,
      CAST(concat('[', group_concat(json_quote(s.name) ORDER BY s.name SEPARATOR ','), ']') as json) AS societyNames
    FROM
      events e
      INNER JOIN society_event se
        ON se.event_id = e.id
      INNER JOIN societies s
        ON s.id = se.society_id
    WHERE
      s.id in (?) AND
      e.date > '${startDate} 00:00:00'
    GROUP BY
      e.id
    `, [selected], 
    (err, results, fields) => {
      if (err) throw err;
      const events = results.sort((ev1, ev2) => Number(ev1.date) - Number(ev2.date))
      res.json(events)
      results.forEach((event, i) => console.log( i, JSON.parse(event.societyNames) ))
    }
  )

})

//send society info 
app.get('/api/societies', (req, res) => {
  console.log("sent societies")
  res.json(societies)
})

//send react app
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/:page', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 80);
