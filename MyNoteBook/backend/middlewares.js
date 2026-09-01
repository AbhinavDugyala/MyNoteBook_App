require('dotenv').config()

const { userSchema, userSchemaLogin, newNoteSchema } = require('./joiSchema')
const ExpressError = require('./utils/ExpressError')
const { verifyToken } = require('./utils/token')

module.exports.validateUserRegister = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.validateUserLogin = (req, res, next) => {
    const { error } = userSchemaLogin.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.fetchUser = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).json({ success: false, message: 'Please sign in to continue' })
    }
    try {
        const data = verifyToken(token)
        req.user = data.user
        next()
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' })
    }
}

module.exports.validateNewNote = (req, res, next) => {
    const { error } = newNoteSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    }
    next()
}
