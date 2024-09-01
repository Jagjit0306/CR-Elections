const mongoose = require('mongoose')

const voterSchema = mongoose.Schema({
    roll: Number,
    name: String
})

module.exports = mongoose.model('voters', voterSchema)