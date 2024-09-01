const students = require('../models/studentlist')
const voters = require('../models/voter')

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})

async function Token (req, res) {
    const refreshToken= req.cookies.RT
    if (refreshToken == null) res.sendStatus(401)
    const tokenCheck = await refreshTokens.findOne({token:refreshToken})
    if(tokenCheck) {
        console.log('Refresh token verified')
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
            if (err) res.sendStatus(403) // token invalid
            else {
                const accessToken = generateAccessToken({userid: user.userid})
                res.cookie('AT', accessToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: 'true',
                    path: '/'
                })
                res.json({status: 'complete'})
            }
        })
    }
    else {
        res.sendStatus(403) //token not found in database
    }
}

async function UsernameCheck(req, res) {
    if(!req.query.username) res.sendStatus(401)
    else {
        const duplicateUser = await users.findOne({username: req.query.username})
        if(duplicateUser) res.json({exists:true})
        else res.json({exists:false})
    }
}

async function ValidateToken(req, res) {
    if(!req.cookies.RT) res.sendStatus(401)
    else {
        const validity = await refreshTokens.findOne({token: req.cookies.RT})
        if(!validity) res.json({validity: false})
        else res.json({validity: true})
    }
}

async function Greet(req, res) {
    if(!req.query.rno) res.sendStatus(403)
    else {
        const studentExists = await students.findOne({roll: req.query.rno})
        if(!studentExists) res.sendStatus(404)
        else {
            const alreadyVoted = await voters.findOne({roll: req.query.rno})
            if(alreadyVoted) res.sendStatus(405)
            else {
                if(studentExists.branch=='ec.24')
                    res.json({name: studentExists.name})
                else res.sendStatus(401)
            }
        }
    }
}

module.exports = { Token, UsernameCheck, ValidateToken, Greet }