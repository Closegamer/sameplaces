const nodemailer = require('nodemailer');

const sendMail = (from, to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
      user: '',
      pass: ''
    }
  });
  const mailOptions = {
    from, //'Pteat <***>',
    to, //'***',
    subject, //: 'Hello',
    html //: '<b>test</b>'
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      return console.log(err);
    }
    return console.log('Message sent: ' + info.response);
  });
};

module.exports = sendMail;
