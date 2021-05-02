const express = require('express')
const router  = express.Router()
const views   = require('./views.js')


// create new user
router.post('/create-new-account', (request, response) => views.createUserAccount(request, response))

// login 
router.post('/login', (request, response) => views.loginUser(request, response))


module.exports = router