const express = require('express')
const router = express.Router()

const { Greet } = require('./controller/basic')

router.get('/greet', Greet)

module.exports = router