const students = require('../models/studentlist')
const voters = require('../models/voter')
const candidates = require('../models/candidate')
const otps = require('../models/otp')

const {Mail} = require('../functions/mailer')

function gen10dig() {
    const min = 1000000000; // Minimum 10-digit number (inclusive)
    const max = 9999999999; // Maximum 10-digit number (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function Vote(req, res) {
    if(!(req.body.voteM&&req.body.voteF&&req.body.rno)) res.sendStatus(401)
    else {
        const user = await students.findOne({roll: req.body.rno})
        if(user) {
            const hasVoted = await voters.findOne({roll: req.body.rno})
            if(hasVoted) res.sendStatus(405)
            else {
                const McandidateFound = await candidates.findOne({name: req.body.voteM, gender:'M'})
                if(McandidateFound){
                    McandidateFound.votes += 1
                    await McandidateFound.save()
                } else {
                    candidates.create({
                        name: req.body.voteM,
                        gender:'M',
                        votes: 1
                    })
                }
                const FcandidateFound = await candidates.findOne({name: req.body.voteF, gender:'F'})
                if(FcandidateFound){
                    FcandidateFound.votes += 1
                    await FcandidateFound.save()
                } else {
                    candidates.create({
                        name: req.body.voteF,
                        gender:"F",
                        votes: 1
                    })
                }
                const voted = await voters.create({roll: req.body.rno})
                await otps.findOneAndDelete({roll: req.body.rno})
                if(voted) res.sendStatus(200)
                else res.sendStatus(500)
            }
        }
        else res.sendStatus(403)
    }
} 

async function verOTP(req, res) {
    if(!(req.query.otp&&req.query.rno)) res.sendStatus(401)
    else {
        const validity = await otps.findOne({roll: req.query.rno, otp: req.query.otp})
        if(!validity) res.sendStatus(404)
            else res.sendStatus(200)
    }
}

async function verEmail(req, res) {
    if(!(req.body.email&&req.body.rno)) res.sendStatus(401)
    else {
        const theUser = await students.findOne({roll: Number(req.body.rno)})
        if(!theUser) res.sendStatus(404)
        else {
            const mp = req.body.email.split('.ec.24@nitj.ac.in')
            if(mp[1]==''&&(mp[0].includes(String(theUser.name.split(' ')[0]).toLowerCase()))){
                await otps.deleteMany({roll: req.body.rno})
                const otp = gen10dig()
                const dt = new Date( Date.now() + 2*60*60000 ) //link expires after 2 hours
                await otps.create({
                    roll: req.body.rno, 
                    otp: otp, 
                    expiresAfter: dt})
                const linkString = `http://${req.headers.host}/vote?rno=${req.body.rno}&key=${otp}`
                {
                    const mailConfig = {
                        email: req.body.email,
                        subject: 'Vote for ECE\'28 CR !',
                        path: 'verifOtp.ejs',
                        config: {OTP: linkString}
                    }
                    const mailStatus = await Mail(mailConfig)
                    if(mailStatus==true) {}
                }

                res.sendStatus(200)
            }
            else {
                res.sendStatus(403)
            }
        }
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

async function Result(req, res) {
    const results = await candidates.find()
    if(results) res.json({data: results})
        else res.sendStatus(500)
}

function LiveTime(req, res) {
    res.json({time: Date.now()})
}

module.exports = { Greet, verEmail, Vote, verOTP, Result, LiveTime }