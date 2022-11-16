const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'test@gmail.com',
        subject: 'Node Email Sender',
        text: `Welcome to the Task MAnager App, dear ${name}!`
    })
    
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'test@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}, I hope to see you back sometime soon! We will appreciate you if you tell us the reason you are leaving`
    })
    
}

module.exports = {
    // sendWelcomeEmail: sendWelcomeEmail
    sendWelcomeEmail,
    sendCancelationEmail
}