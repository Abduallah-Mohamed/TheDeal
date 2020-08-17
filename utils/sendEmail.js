const nodemailer = require('nodemailer');

const sendEmailFunction = async(options) => {
    // ! 1) create transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "ab3e4625cb33c1",
            pass: "ec778a4831b27f"
        }
    });

    // ! 2) create the mail options
    const mailOptions = {
        from: 'Abduallah Mohamed <Abduallah@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // ! 3) send Email
    await transporter.sendMail(mailOptions);
}


module.exports = sendEmailFunction;