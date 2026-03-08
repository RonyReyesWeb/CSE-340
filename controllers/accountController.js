const utilities = require('../utilities')

async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render('account/login', {
      title: 'Login',
      nav,
      messages: req.flash() 
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { buildLogin }