const nodemailer = require('nodemailer');

const sendEmail = options => {
    //1. Create transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            
        }
    });

    //2. Define email options

    //3. Actually send the email
};