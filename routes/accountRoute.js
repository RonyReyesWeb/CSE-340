const express = require('express')
const router = express.Router()
const regValidate = require('../utilities/account-validation')
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')

// Login view route
router.get('/login', accountController.buildLogin)

// Registration view route
router.get('/register', accountController.buildRegister)

/// Registration handling errors
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Week5 - modifying the router post
router.post( "/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

// Week 5 project
// Account update view
router.get("/update/:account_id", utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateView))

// Account info update POST
router.post("/update", utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount))

// Password update POST
router.post("/update-password", utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword))

// Logout
router.get("/logout", accountController.logout)

module.exports = router

