const passport = require('passport')

const ensureAuthenticated = (req, res, next) => {
  if ( req.isAuthenticated() ) {
    return next()
  }
  res.redirect('/')
}

const routesDashboard = (app, db) => {
  // add pug as the view engine
  app.set('view-engine', 'pug')
  
  // login 
  app.get('/auth/google',
    passport.authenticate('google', {scope: ['openid', 'email', 'profile']})
  );

  // the callback after google has authorized the user
  app.route('/auth/google/callback')
    .get(passport.authorize('google', {failureRedirect : '/login-failed'}), (req, res) => {
      res.redirect("/dashboard/profile")
    });


  app.get("/auth/login/success", ensureAuthenticated, (req, res) =>
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    })
  );

  app.route('/dashboard/profile')
    .get(ensureAuthenticated, (req, res) => {
      res.render("/views/pug/profile", {name: req.user.name})
    })
}

module.exports = routesDashboard;