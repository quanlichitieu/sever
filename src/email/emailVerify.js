const nodemailer = require('nodemailer')

module.exports = function (email, userID) {
    const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailDetails = {
        from: '"quanlichitieu noreply" <nodemailer.com>',
        to: email,
        subject: 'verify your email',
        html: `
            <h1>verify your email</h1>
            <p>please click the link below to verify your email</p>
            <a href="${process.env.DEPLOY_URL}/api/user/emailVerify/${userID}">verify</a>`
    }

    mailTransport.sendMail(mailDetails, (err, info) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}