module.exports = (req, res) => {
  res.status(404).render('404', 
  { 
    pageTitle: 'Page not found',
    path: '',
    isAuthenticated: rq.session.isLoggedIn
  })
}