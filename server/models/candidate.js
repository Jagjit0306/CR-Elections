const mongoose = require('mongoose')

const candidateSchema = mongoose.Schema({
    name: {
        type:String,
        unique: true
    },
    gender:String,
    votes: Number
})

module.exports = mongoose.model('candidates', candidateSchema)