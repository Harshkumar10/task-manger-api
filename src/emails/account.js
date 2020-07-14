const sgMail=require('@sendgrid/mail');

//A dummy value
const sendgridAPIKey='23';

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        form:'kumarharshid10@gmail.com',
        subject:'Thanks for joing',
        text:`Welcome ${name} ,just account created`
    })
}

module.exports={
    sendWelcomeEmail
}
// const msg = {
//     to: 'kumarharshid10@gmail.com',
//     from: 'kumarharshid10@gmail.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js'
//   };
// sgMail.send(msg).then(() => {
//     console.log('Message sent')
// }).catch((error) => {
//     console.log(error.response.body)
//     // console.log(error.response.body.errors[0].message)
// })