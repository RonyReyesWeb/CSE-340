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

// Process the login attempt
router.post("/login",(req, res) => {res.status(200).send('login process')})

module.exports = router

