const passport = require('passport')

const routesDashboard = (app, db) => {
  // add pug as the view engine
  app.set('view-engine', 'pug')
  
  // login 
  app.get('/auth/google',
    passport.authenticate('google', {scope: ['openid', 'email', 'profile']})
  );

  // the callback after google has authorized the user
  app.get('/auth/google/callback',
    passport.authorize('google', {
      successRedirect : '/dashboard/profile',
      failureRedirect : '/login-failed'
    }
  ));
}

module.exports = routesDashboard;