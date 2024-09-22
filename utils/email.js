const nodemailer = require('nodemailer');
// clea
const renderWelcomeEmail = require('./renderWelcomeEmail'); 

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Tihomir Zhelyazkov <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'retha.walsh@ethereal.email',
        pass: 'bf1s4rvVDZW1FqMpu4'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Send actual email
  async send(template, subject) {
    // 1. Render HTML
    const html = renderWelcomeEmail(this.firstName, this.url);


    // 2. Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      // text: htmlToText.fromString(html)
      text: html.replace(/<[^>]*>/g, ''),
    };

    // 3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }
};
