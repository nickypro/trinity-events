const express = require('express')
const path = require('path');
const app = express();
const dateFormat = require('dateformat');

const mysql = require('mysql')
const creds = require('./mysql-credentials.json')

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

//send event data
app.get('/api/eventdata', async (req, res) => {
  console.log("sending event data")
  
  let selected = []
  if (req.query.socs) selected = await JSON.parse(req.query.socs)
  if (selected.length === 0) {
    console.log("selected has length zero")
    selected = listOfSocIds
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
