const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const configAuth = require('./configAuth.json')

const fs = require('fs');
const util = require('util');
const log_file = fs.createWriteStream(__dirname + `/auth.log`, {flags : 'w'});
const log = (d) => log_file.write(util.format(d) + '\n');

const auth = (app, db) => {try {
  passport.serializeUser((user, done) => {
    console.log(user)  
    done(null, user.openid)
  })

  passport.deserializeUser((openid, done) => {
    db.query(`SELECT * FROM society_logins WHERE openid = '${openid}'`, (err, rows) => {
      if (err) {
        return done(err);
      }
      done(null, rows[0])
    })
  })

  passport.use(new GoogleStrategy({
    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,
  }, (token, refreshToken, profile, done) => {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    //process.nextTick(function() {
    process.nextTick( () => {
      const email   = profile.emails[0].value
      const openid  = profile.id
      const name    = profile.displayName
      const picture = profile.photos[0] ? profile.photos[0].value : null
      
      if (!email) 
        return done({message: " - ERROR: no email specified"})

      db.query(`SELECT * FROM society_logins WHERE email = "${email}";`, (err, rows) => {
        if (err) 
          return done(err)

        if (rows.length > 1) {
          log(" - ERROR: ID not specified")
          return done({message: " - ERROR: ID not specified"})
        }

        if (rows.length === 1) {
          //if found, then login
          log( JSON.stringify(rows[0]) )
          return done(null, rows[0])

        } else {
          //make sure their email is a society email
          db.query(`SELECT id, email FROM societies WHERE email = "${email}"`, (err, rows) => {
            if (err)
              return done(err)
            
            log(rows)
            if (!rows || rows.length === 0) {
              //if there is no such email, then return an error
              log(" - ERROR: Non-society email login attempt")
              return done({message : " - ERROR: Non-society email login attempt"})

            } else {
              // if it is a society email, then add them to the database
              console.log(profile)
              
              const id = rows[0].id
              log(`adding user ${id} ${openid}, ${email}, ${name}, ${token}, ${picture}`)

              db.query(`
                INSERT INTO society_logins (  id,     openid,      email,      name,      token,      picture) 
                                    VALUES (${id}, "${openid}", "${email}", "${name}", "${token}", "${picture}");`
              , (err, result) => {
                if (err)
                  return done(err)

                return done(null, {openid, name, email, token, picture})
              })
            }
          })
        } 
      })
    })

  }));

} catch (err) {
  console.log(" - ERROR could not get back-end working : ", err.message)
}}

module.exports = auth;