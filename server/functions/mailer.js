const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const fs = require('fs')
const express = require('express')
const ejs = require('ejs')
const app = express()
dotenv.config({path: '../.env'})
app.set("view engine" , "ejs");

async function Mail(mailThis) {

    // mailThis -> email, path, subject, config

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_ACCESSTOKEN
      }
    });
    let mailOptions = {
      from: `CR Elections - ECE28 <${process.env.MAIL_USERNAME2}>`,
      to: mailThis.email,
      subject: mailThis.subject,
      attachments: mailThis.attachments,
      html: ejs.render(fs.readFileSync(__dirname+'/../views/'+mailThis.path, 'utf-8'), mailThis.config)
    };

    transporter.sendMail(mailOptions, function(err, data) {
      if(err) {
            console.log('Error sending mail '+err)
            return false
      }
    })
    return true
}

module.exports = { Mail }