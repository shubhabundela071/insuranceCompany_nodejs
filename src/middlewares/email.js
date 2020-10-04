const sgMail = require('@sendgrid/mail');
const sendgrid = require('../config/index').sendgrid;
sgMail.setApiKey(sendgrid);
module.exports.sendEmail = async (to, subject, text) => {
  // for email   
    const msg = {
        to: to,
        from: 'shubhabundela071@gmail.com',
        subject: subject,
        html: text
    };
    sgMail.send(msg)
        .then(() => {
            //Celebrate
            console.log("sent")
        })
        .catch(error => {

            //Log friendly error
            console.error(error.toString());

            //Extract error msg
            const {
                message,
                code,
                response
            } = error;

            //Extract response msg
            const {
                headers,
                body
            } = response;
        });
}
