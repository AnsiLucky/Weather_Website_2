// const flash = require('express-flash');
function checkNotAuthentificated(req, res, next) {
  if (req.session.isAuthenticated === undefined) return next();
  res.redirect('/')
}

function checkAuthentificated(req, res, next) {
  if (req.session.isAuthenticated === undefined) return res.redirect('/login');
  if (req.session.isAuthenticated) return next();
}

function checkIsAdmin(req, res, next) {
  if (req.session.isAdmin !== true) {
    req.flash('error', 'You are not Admin');
    return res.redirect('/');
  }
  return next();
}

module.exports = {checkAuthentificated, checkNotAuthentificated, checkIsAdmin}