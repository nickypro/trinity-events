const mysql = require('mysql');
const credentials = require('../mysql-credentials.json')

const connection = mysql.createConnection(credentials);

// connect to the MySQL server
connection.connect((err) => {
  if (err) return console.error('error: ' + err.message);
 
  let createSocietiesTable = 
    `CREATE TABLE IF NOT EXISTS societies(
      id              INT           primary key,
      name            varchar(255)  not null,
      url             varchar(255)  not null,
      website         varchar(255),
      about           varchar(2047),
      email           varchar(255),
      facebook        varchar(255),
      facebookHandle  varchar(255),
      twitter         varchar(255),
      instagram       varchar(255),
      snapchat        varchar(255),
      constitution    varchar(255),
      lastScraped     DATETIME
    )`;
      
  connection.query(createSocietiesTable, (err, results, fields) => {
    if (err) console.log(err.message);
  });
    
  let createEventsTable = 
    `CREATE TABLE IF NOT EXISTS events(
    id        BIGINT        PRIMARY KEY,
    url       VARCHAR(255)  NOT NULL,
    title     VARCHAR(255)  NOT NULL,
    date      DATE          NOT NULL,
    until     DATE,
    location  VARCHAR(255),
    archived  BOOLEAN,
    multipleHosts     VARCHAR(255)
  )`;

  connection.query(createEventsTable, (err, results, fields) => {
    if (err) console.log(err.message);
  });

  const createJoinTable = `
    CREATE TABLE IF NOT EXISTS society_event (
      event_id    BIGINT  NOT NULL,
      society_id  INT     NOT NULL,
      PRIMARY KEY (event_id, society_id),
      FOREIGN KEY (event_id)    REFERENCES events (id),
      FOREIGN KEY (society_id)  REFERENCES societies (id)
  );`;

  connection.query(createJoinTable, (err, results, fields) => {
    if (err) console.log(err.message);
  });

  connection.end(err => {
    if (err) return console.log(err.message)
  });

});

return connection;