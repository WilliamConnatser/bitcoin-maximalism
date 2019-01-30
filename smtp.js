//Nodemailer NPM package used to send emails
const nodemailer = require("nodemailer");

//Create reusable transporter object using the default SMTP transport
const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOSTNAME,
    port: process.env.EMAIL_PORT,
    secure: true, //true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

//Output connection status to server console
emailTransporter.verify((err, success) => {
    if (err) console.error(err);
    if (success) console.log('Your nodemailer config is working');
});

//Create Default registration email
const registrationEmail = {
    from: '"Bitcoin Maximalism" <admin@BitcoinMaximalism.com>', //sender address
    to: "bar@example.com, baz@example.com", //list of receivers
    subject: "Confirm Your Email for BitcoinMaximalism.com", //Subject line
    text: "Thanks for registering for BitcoinMaximalism.com!! Please confirm your email address by navigating to: ", //plain text body
    html: 'Thanks for registering for <a href="www.BitcoinMaximalism.com">BitcoinMaximalism.com</a>!! Please confirm your email address by navigating to: ' //html body
};

module.exports = {
    emailTransporter,
    registrationEmail
};