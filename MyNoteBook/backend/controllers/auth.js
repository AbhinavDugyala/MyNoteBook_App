if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const crypto = require('crypto')

const User = require('../models/User')
const ExpressError = require('../utils/ExpressError')
const sendEmail = require('../utils/sendEmail')
const { signToken } = require('../utils/token')
const publicUser = require('../utils/publicUser')
const offline = require('../store/offline')

const handleDuplicate = (err) => {
    if (err && err.code === 11000) {
        const field = Object.keys(err.keyPattern || err.keyValue || { account: 1 })[0]
        throw new ExpressError(`An account with that ${field} already exists`, 400)
    }
    throw err
}

module.exports.createUser = async (req, res) => {
    if (!offline.isDbReady()) return offline.createUser(req, res)
    const { username, email, password } = req.body
    const user = new User({ username, email, password })
    try {
        await user.save()
    } catch (err) {
        handleDuplicate(err)
    }
    const authToken = signToken(user)
    res.status(201).json({ success: true, user: publicUser(user), authToken })
}

module.exports.loginUser = async (req, res) => {
    if (!offline.isDbReady()) return offline.loginUser(req, res)
    const { username, password } = req.body
    const foundUser = await User.findAndValidate(username, password)
    if (!foundUser) {
        throw new ExpressError('Invalid username or password', 400)
    }
    const authToken = signToken(foundUser)
    res.status(200).json({ success: true, user: publicUser(foundUser), authToken })
}

module.exports.getUser = async (req, res) => {
    if (!offline.isDbReady()) return offline.getUser(req, res)
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
        throw new ExpressError('User not found', 404)
    }
    res.status(200).json({ success: true, user: publicUser(user) })
}

module.exports.forgotPassword = async (req, res, next) => {
    if (!offline.isDbReady()) return offline.forgotPassword(req, res)
    const { email } = req.body
    if (!email) {
        throw new ExpressError('Email is required', 400)
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new ExpressError('No account found with that email. Please register first.', 404)
    }
    const resetToken = await user.getResetPasswordToken()
    await user.save()

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`
    const message = `
    <h1>Reset your myNoteBook password</h1>
    <p>We received a request to reset your password. This link expires in 10 minutes.</p>
    <p><a href="${resetUrl}" clicktracking="off">${resetUrl}</a></p>
    <p>If you did not request this, you can ignore this email.</p>
    `

    try {
        await sendEmail({
            to: user.email,
            subject: 'myNoteBook password reset',
            text: message
        })
        res.status(200).json({ success: true, message: 'Reset email sent. Check your inbox.' })
    } catch (error) {
        if (error.code === 'EMAIL_NOT_CONFIGURED') {
            return res.status(200).json({
                success: true,
                message: 'Email is not configured on this server. Use the reset link below (valid for 10 minutes).',
                resetUrl
            })
        }
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        return next(new ExpressError('Email could not be sent. Try again later.', 500))
    }
}

module.exports.resetPassword = async (req, res) => {
    if (!offline.isDbReady()) return offline.resetPassword(req, res)
    const { password } = req.body
    if (!password || password.length < 5) {
        throw new ExpressError('Password must be at least 5 characters', 400)
    }
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        throw new ExpressError('This reset link is invalid or has expired', 404)
    }
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    res.status(200).json({ success: true, message: 'Password updated. You can sign in now.' })
}
