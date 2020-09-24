const createTablesInMySQL = require('./createTablesInMySQL')
const getSocieties = require('./scrapeListOfSocieties')
const getSocietyInfo = require('./scrapeSocietyInfo')
const updateSocietyInfo = require('./insertSocietyInfoToMySQL')

const mysql = require('mysql');
const credentials = require('../config/mysql-credentials.json')

const connection = mysql.createConnection(credentials);

function timeout(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

(async () => {
  await createTablesInMySQL(connection)

  const societies = await getSocieties()
  console.log(societies)

  for (i in societies) {
    const info = await getSocietyInfo(societies[i])
    updateSocietyInfo(info)
    await timeout(200)
  }

  console.log("finished uploading society info")
})()