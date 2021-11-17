var express = require('express');
var router = express.Router();
var hbs = require('nodemailer-express-handlebars');
const Joi = require('joi');

var MailConfig = require('server/helper/email');
var gmailTransport = MailConfig.GmailTransport;
const authorize = require('server/middleware/authorize');
const validateRequest = require('server/middleware/validate-request');

module.exports = router;

function sendSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    message: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

router.post('/send', authorize(), sendSchema, (req, res, next) => {
  let email = req.body.email;
  let message = req.body.message;

  MailConfig.ViewOption(gmailTransport, hbs);

  let HelperOptions = {
    from: 'Ergoseatings Team',
    to: email,
    from: 'yellowbearpooh0110@gmail.com',
    subject: 'Erogseatings Invoice!',
    template: 'invoice',
    context: {
      message: message,
    },
  };
  gmailTransport.sendMail(HelperOptions, (error, info) => {
    if (error) {
      console.log(error);
      next(error);
    }
    console.log('email is send');
    console.log(info);
    res.send(info);
  });
});

// router.get('/smtp/template', (req, res, next) => {
//   MailConfig.ViewOption(smtpTransport, hbs);
//   let HelperOptions = {
//     from: '"Tariqul islam" <tariqul@falconfitbd.com>',
//     to: 'tariqul.islam.rony@gmail.com',
//     subject: 'Hellow world!',
//     template: 'invoice',
//     context: {
//       name: 'tariqul_islam',
//       email: 'tariqul.islam.rony@gmail.com',
//       address: '52, Kadamtola Shubag dhaka',
//     },
//   };
//   smtpTransport.verify((error, success) => {
//     if (error) {
//       res.json({ output: 'error', message: error });
//       res.end();
//     } else {
//       smtpTransport.sendMail(HelperOptions, (error, info) => {
//         if (error) {
//           res.json({ output: 'error', message: error });
//         }
//         res.json({ output: 'success', message: info });
//         res.end();
//       });
//     }
//   });
// });
