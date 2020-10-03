var fs = require('fs');
var {getURL} = require('./funcs')

var SMTP_USERNAME = process.env.SMTP_USERNAME;
var SMTP_PASSWORD = process.env.SMTP_PASSWORD;
var SENDGRID_API_KEY = process.env.SENDGRID_KEY;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


var env = process.env.NODE_ENV || "development";

var MailController = {};
// let mg = (env=="development")? mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: ""});

// var smtpConfig = {
//     host: 'email-smtp.eu-west-1.amazonaws.com',
//     port: 465,
//     secure: true, // upgrade later with STARTTLS
//     auth: {
//        user: SMTP_USERNAME,
//        pass: SMTP_PASSWORD
//     }
// });

MailController.sendEmail =(mailOptions)=> {
    // define type for mailOptions
    return new Promise((resolve, reject) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
      sgMail
        .send(mailOptions)
        .then((result) => {
          return resolve(result);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
module.exports = MailController