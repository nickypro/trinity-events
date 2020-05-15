//const connectToMySQL = require('./connectToMySQL')
const getSocieties = require('./getSocieties')
const getSocietyInfo = require('./getSocietyInfo')
const updateSocietyInfo = require('./updateSocietyInfo')

const mysql = require('mysql');
const credentials = require('../mysql-credentials.json')

const connection = mysql.createConnection(credentials);

//connectToMySQL()

function timeout(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

(async () => {
  const societies = await getSocieties()
  
  console.log(societies)
  
  for (i in societies) {
    const info = await getSocietyInfo(societies[i])
    updateSocietyInfo(info)
    await timeout(200)
  }

  console.log("finished uploading society info")
})()