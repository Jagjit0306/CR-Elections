const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    roll: Number,
    name: String,
    branch: String
})

module.exports = mongoose.model('students', studentSchema)