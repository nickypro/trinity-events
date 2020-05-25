require('dotenv').config()
const express = require('express')
const session = require('express-session')
const path = require('path');
const app = express();
require('dotenv').config({ path: path.resolve(__dirname, './.env') })

const https = require('https');
const fs = require('fs');

const util = require('util');
const log_file = fs.createWriteStream(__dirname + `/debug.log`, {flags : 'w'});
const log = (d) => log_file.write(util.format(d) + '\n');

const mysql = require('mysql')
const creds = require('./mysql-credentials.json')

const passport = require('passport')
const cors     = require('./cors')
const auth  = require('./auth')

const routesApi = require('./routesApi') 
const routesDashboard = require('./routesDashboard')

const getSocieties = require('./functions/getSocieties')
const getEventsFromMySQL = require('./functions/getEventsFromMySQL')

//working memory data
let societies = []
let eventsFromToday = []

//used functions
const todayStringYMD = require('./functions/todayStringYMD')

const connection = mysql.createConnection(creds)

//app setup
app.use(express.static(path.join(__dirname, 'build')));

//app passport setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())

//Logger
const logger = (req, res, next) => {
  console.log(`${new Date().toUTCString()} - ${req.method} ${req.path} - ${req.ip}`);
  log(`${new Date().toUTCString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
}
app.use(logger)

//get all the societies from the database
connection.connect(async (err) => {  
  if (err) { 
    log(` - ERROR connecting to database : ${err.message}`)
    console.error('error: ' + err.message)
    return;
  }
  
  // get and save events from today
  getEventsFromMySQL(connection, todayStringYMD(), (eventsRecieved) => {
    eventsFromToday = eventsRecieved
  })

  // get and save list of all societies
  societies = await getSocieties(connection, log)

  //routes for /api calls
  routesApi(app, connection, societies, eventsFromToday, log)

  //add passport authentication and societies dashboard
  auth(app, connection)
  routesDashboard(app, connection)

  //redirect /admin to the strapi server
  app.get('/admin', (req, res) => {
    res.redirect('http://trinityevents.ie:57692/admin/')
  })

  //send react app
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  app.get('/:page', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  // we will host the app on http as well
  app.listen(process.env.PORT || 80, () => {
    console.log(`HTTP  Listening on port ${process.env.PORT || 80}`)
    log(`HTTP  Listening on port ${process.env.PORT || 80}`)
  });

  // we will pass our 'app' to 'https' server
  try {
    https.createServer({
      key: fs.readFileSync(process.env.PRIVATE_SSL_KEY || './key.pem'),
      cert: fs.readFileSync(process.env.SSL_CERTIFICATE || '/cert.pem'),
    }, app)
    .listen(process.env.SSL_PORT || 443, () => {
      console.log(`HTTPS Listening on port ${process.env.SSL_PORT || 443}`)
      log(`HTTPS Listening on port ${process.env.SSL_PORT || 443}`)
    });
  } catch (err) {
    console.log("SSL server initialization failed : ", err.message)
    log("SSL server initialization failed : ", err.message)
  }

});