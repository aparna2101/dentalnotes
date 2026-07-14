const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var path = require('path');
var fs = require('fs');
// const temp = require('../templates/index.html')
// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
// 	host: process.env.EMAIL_SMTP_HOST,
// 	port: process.env.EMAIL_SMTP_PORT,
//secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
// 	auth: {
// 		user: process.env.EMAIL_SMTP_USERNAME,
// 		pass: process.env.EMAIL_SMTP_PASSWORD
// 	}
// });
const logo = ` ${
  process.env.REQ_URL
    ? `${process.env.REQ_URL}images/inherit-logo.png`
    : `https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png`
} `;
const mailOptions = {
  from: `indradhanuexhibition@gmail.com`,
  subject: null,
  to: null,
  html: null,
  direct: true,
  attachments: null,
};
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.GMAIL_SEND_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
  from: process.env.GMAIL_SEND_EMAIL,
});
// to read the template
var readHTMLFile = function (path, callback) {
  fs.readFile(
    path,
    {
      encoding: 'utf-8',
    },
    function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    }
  );
};

exports.send = function (from, to, subject, html) {
  // send mail with defined transport object
  // visit https://nodemailer.com/ for more options
  return transporter.sendMail({
    from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻 " <foo@example.com>
    to: to, // list of receivers e.g. bar@example.com, baz@example.com
    subject: subject, // Subject line e.g. 'Hello ✔'
    //text: text, // plain text body e.g. Hello world?
    html: html, // html body e.g. '<b>Hello world?</b>'
  });
};

exports.sendMail = (data) => {
  // data.logo = logo;
  console.log('Data sending to Email',data);
  readHTMLFile(`${__dirname}/../templates/${data.temp}`, function (err, html) {
    var template = handlebars.compile(html);
    var replacements = data;
    mailOptions.html = template(replacements);
    mailOptions.subject = data.subject;
    mailOptions.to = data.email;
    mailOptions.attachments = null;

    triggerMail(mailOptions);
  });
};

exports.setPwdSendMail = (req, data) => {
  data.logo = logo;
  readHTMLFile('templates/assign/set-pwd.html', function (err, html) {
    var template = handlebars.compile(html);
    var replacements = data;
    if (data.lawFirm) {
      mailOptions.from = `${data.lawFirm} < inheritchainadmin@gmail.com >`;
    }
    mailOptions.html = template(replacements);
    mailOptions.subject = 'Verify and set password';
    mailOptions.to = data.email;
    mailOptions.attachments = null;
    triggerMail(mailOptions);
  });
};

exports.sendForgetMail = (data) => {
  readHTMLFile(`${__dirname}/../templates/forgetPassword.html`, function (err, html) {
    if (err) {
      console.log('Error reading forget password template', err);
      return;
    }
    var template = handlebars.compile(html);
    var replacements = data;
    mailOptions.from = `"DentalNotes" <${process.env.GMAIL_SEND_EMAIL}>`;
    mailOptions.html = template(replacements);
    mailOptions.subject = 'Reset Your Password - DentalNotes';
    mailOptions.to = data.email;
    mailOptions.attachments = null;
    triggerMail(mailOptions);
  });
};

exports.sendSignupOtpMail = (data) => {
  readHTMLFile(`${__dirname}/../templates/signupOTP.html`, function (err, html) {
    if (err) {
      console.log('Error reading signup OTP template', err);
      return;
    }
    var template = handlebars.compile(html);
    var replacements = data;
    mailOptions.from = `"DentalNotes" <${process.env.GMAIL_SEND_EMAIL}>`;
    mailOptions.html = template(replacements);
    mailOptions.subject = 'Verify Your Account - DentalNotes';
    mailOptions.to = data.email;
    mailOptions.attachments = null;
    triggerMail(mailOptions);
  });
};


function triggerMail(mailOptions) {
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('A assign to email has been sent.', info);
    }
  });
}

function send(data) {
  data.logo = logo;
  readHTMLFile('templates/assign/assignTo.html', function (err, html) {
    var template = handlebars.compile(html);
    var replacements = data;
    mailOptions.html = template(replacements);
    mailOptions.subject = 'ASSIGN TO';
    mailOptions.to = data.email;
    mailOptions.attachments = null;
    triggerMail(mailOptions);
  });
  triggerMail(mailOptions);
}
