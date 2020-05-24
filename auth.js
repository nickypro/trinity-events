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
      db.query(`SELECT * FROM society_logins WHERE openid = "${profile.id}";`, (err, rows) => {
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
          const email = profile.emails[0].value
          if (!email) 
            return done(null, user)

          db.query(`SELECT email FROM societies WHERE email = "${email}"`, (err, user) => {
            if (err)
              return done(err)
            
            if (!user) {
              //if there is no such email, then return an error
              log(" - ERROR: Non-society email login attempt")
              return done({message : " - ERROR: Non-society email login attempt"})

            } else {
              // if it is a society email, then add them to the database
              console.log(profile)
              const openid  = profile.id
              const name    = profile.displayName
              const token   = profile.token
              
              log(`adding user ${openid}, ${email}, ${name}, ${token}`)

              db.query(`
                INSERT INTO society_logins (  openid,    email,    name,    token ) 
                                    VALUES (${openid}, ${email}, ${name}, ${token});`
              , (err, result) => {
                if (err)
                  return done(err)

                return done(null, {openid, name, email, token})
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