# trinity-events
A website to easily find societies and events in trinity

## features
Scrapes events for each society from facebook every 24hours
Makes it easy to keep up with events from societies you are interested in

## apis
visit /api for more information

## installation
Note that you must have NodeJS and a MySQL 5.7 server installed. You will also need an api key from "https://www.scraperapi.com/"

1. First, you need to initialise a database called "TrEvents":
`CREATE DATABASE TrEvents;`
2. Create a user with which to access the events (using `sudo mysql -u root` or otherwie). 
   replace "newuser" and "password" with your own values:

i)  `CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';`

ii) `GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';`

iii)`FLUSH PRIVILEGES;`

3. Add the newuser & password to mysql-credentials.json.
4. Add your "https://www.scraperapi.com/" api key(s) to scraperApiKeys.js
4. Run `npm install` from the "trinity-events" directry.
5. Run `node ./initial-setup/setup.js` to set up the tables in MySQL. 
   This may take a while as the societies need to be scraped one at a time. 
   You could also edit the script to use societies from your own database.
6. Run `npm run build`to compile the react page.
7. Run `node server.js` to start the server. 
   This could be added to systemd to be run always run, or run with "forever" or "nodemon" to suit your needs
