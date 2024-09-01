const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    roll: Number,
    otp: Number,
    expiresAfter: {
        type: Date
    }
})

module.exports = mongoose.model('otp', otpSchema)