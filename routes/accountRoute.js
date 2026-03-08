const express = require('express')
const router = express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')

router.get('/login', accountController.buildLogin)
module.exports = router

