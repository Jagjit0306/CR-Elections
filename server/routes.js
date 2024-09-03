const express = require('express')
const router = express.Router()

const { Greet, verEmail, Vote, verOTP, Result, LiveTime } = require('./controller/basic')

router.get('/greet', Greet)

router.post('/verEmail', verEmail)

router.post('/vote', Vote)

router.get('/verOTP', verOTP)

router.get('/result', Result)

router.get('/time', LiveTime)

module.exports = router