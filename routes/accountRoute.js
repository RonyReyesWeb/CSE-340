const express = require('express')
const router = express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')

// Login view route
router.get('/login', accountController.buildLogin)

// Registration view route
router.get('/register', accountController.buildRegister)

module.exports = router

