const express = require('express')
const router = express.Router()

const { Greet, verEmail, Vote, verOTP } = require('./controller/basic')

router.get('/greet', Greet)

router.post('/verEmail', verEmail)

router.post('/vote', Vote)

router.get('/verOTP', verOTP)

module.exports = router