const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express()

dotenv.config()
mongoose.connect(process.env.DATABASE1_KEY)
 
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(cookieParser())

app.listen(process.env.SERVER_PORT, ()=>{
    console.log('Server is listening on', process.env.SERVER_PORT)
})

app.use('/api', require('./routes'))

app.use(express.static(__dirname + '/client/build'))
app.get('*', (req, res)=> res.sendFile(__dirname+'/client/build/index.html'))