const apiKeys = require('../config/scraperApiKeys.js')
const scrapeEvents = require('./scrapeEvents')

const fs = require('fs')
const util = require('util');
const log_file = fs.createWriteStream(__dirname + `/scrape.log`, {flags : 'w'});
const log = (d) => log_file.write(util.format(d) + '\n');

const hour = 3600000
const delay = 24*hour
const randomInt = (max) => Math.floor(Math.random()*max)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeAndUpdate(db, societies) {
    console.log(` - scraping events for ${societies.length} societies`)
    log(` - scraping events for ${societies.length} societies`)
  
    for (i in societies) {
      const soc = societies[i]

      // do not scrape if there is no facebook to scrape, or if scraped recently
      if (!soc.facebookHandle) continue
      if ( Number(new Date()) - Number(new Date(soc.lastScraped)) < delay ) continue
      console.log(` - scraping events for ${soc.name}`)
      log(` - scraping events for ${soc.name}`)
  
      console.log("awaiting cooldown") 
      await sleep(5000);
      console.log("scraping for soc ", soc.name)
      
      //scrape using a random api key
      const scrapeOptions = { 
        scraperApiKey: apiKeys[randomInt(apiKeys.length)], 
        facebookHandle: (soc.facebookHandle)
      }
      const events = await scrapeEvents(scrapeOptions)

	console.log(events)

      //ensure results were successful
      if (!events) continue
      console.log(` - ${events.length} events scraped for ${soc.name} \n`)
      log(`${new Date()} : ${events.length} events scraped for ${soc.name} \n`)
  
      //if so, make MySQL friendly array of values
      const insertToEvents = []
      const insertToJoin = []
      for (i in events) {
        e = events[i]
        insertToEvents.push([e.id, e.url, e.title, e.date, e.location])
        insertToJoin.push([soc.id, e.id])
      }
      
      //update "lastScraped" so only scraped once a day
      db.query(`
        UPDATE societies 
          SET lastScraped = ?
        WHERE 
          id = ${soc.id};
      `, [new Date()], (err, results, fields) => {
        if (err) {
          console.error(`error updating last-scraped time for ${soc.name}:  ${err.message}`);
          log(`error updating last-scraped time for ${soc.name}:  ${err.message}`);
        }
      });
       
      //update the events
      db.query(`
        INSERT INTO events 
          (id, url, title, date, location) 
        VALUES ?
        ON DUPLICATE KEY UPDATE
          title    = VALUES (title), 
          date     = IF( date < NOW() - INTERVAL 90 DAY, date, VALUES (date) ),
          location = VALUES (location);
          `, [insertToEvents], (err, results, fields) => {
        if (err) {
          console.error(`error in events for ${soc.name}:  ${err.message}`);
          log(`error in events for ${soc.name}:  ${err.message} \n ${insertToEvents}`);
        }
      });
  
      //update the join table with those events
      db.query(`
        INSERT IGNORE INTO society_event 
          (society_id, event_id)
        VALUES ?;`, [insertToJoin], (err, results, fields) => {
        if (err) {
          console.log(`error in join for ${soc.name}: `, err.message)
          log(`error in join for ${soc.name}:  \n ${insertToJoin}`, err.message)
        }
      })
  
    }
  }
  
  module.exports = scrapeAndUpdate
