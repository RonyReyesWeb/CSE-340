const utilities = require('../utilities')
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render('account/login', {
    title: 'Login',
    nav
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let errors = []

  if (!account_firstname || account_firstname.trim() === "") {
    errors.push("First name is required.")
  }

  if (!account_lastname || account_lastname.trim() === "") {
    errors.push("Last name is required.")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(account_email)) {
    errors.push("A valid email is required.")
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/
  if (!passwordRegex.test(account_password)) {
    errors.push("Password must be at least 12 characters and include uppercase, number, and special character.")
  }

  // If validation fails
  if (errors.length > 0) {
    req.flash("notice", errors.join(" "))
    return res.render("account/register", {
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email
    })
  }

  // If validation passes → insert into database
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)

    res.status(201).render("account/login", {
      title: "Login",
      nav
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount}