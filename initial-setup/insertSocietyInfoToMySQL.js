const mysql = require('mysql');
const credentials = require('../mysql-credentials.json')

const connection = mysql.createConnection(credentials);

connection.connect((err) => {
  if (err) return console.error('error: ' + err.message);
})

const updateSocietyInfo = (info) => {
  connection.query(`SELECT name FROM societies WHERE id = '${info.id}' `, (err, res) => {
      if (err) return console.log(err.message)
      if (res.length > 0) return console.log("society already in database: ", res)
      else 
        connection.query('INSERT INTO societies SET ?', info, (err, res) => {
          if(err) {
            console.log(info.about)
            throw err;
          }
          console.log('Last insert ID:', res.insertId, " society: ", info.name);
        });
  })
  
  return 0
}


module.exports = updateSocietyInfo
