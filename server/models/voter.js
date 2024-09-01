const mongoose = require('mongoose')

const voterSchema = mongoose.Schema({
    roll: Number
})

module.exports = mongoose.model('voters', voterSchema)