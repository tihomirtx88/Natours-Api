const nodemailer = require('nodemailer');

const sendEmail = async options => {
    try {
      // 1. Create a transporter
      const transporter = nodemailer.createTransport({
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
  
      // 2. Define email options
      const mailOptions = {
        from: 'Tihomir Zhelyazkov <tihomirtx88@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
      };
  
      // 3. Actually send the email
    await transporter.sendMail(mailOptions);
      
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


module.exports = sendEmail;