const nodemailer = require('nodemailer')

const sendEmail = (options) => {
    return new Promise((resolve, reject) => {
        if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
            const err = new Error('Email is not configured')
            err.code = 'EMAIL_NOT_CONFIGURED'
            reject(err)
            return
        }

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        })

        transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
            to: options.to,
            subject: options.subject,
            html: options.text,
        }, (err, info) => {
            if (err) reject(err)
            else resolve(info)
        })
    })
}

module.exports = sendEmail
