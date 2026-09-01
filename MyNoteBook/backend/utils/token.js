const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'b0742345623214e7f5aac75a4200799d80b55d26a62b97cd23015c33ae3ac11513e2e7'

module.exports.signToken = (user) => {
    return jwt.sign(
        { user: { id: user._id } },
        SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
}

module.exports.verifyToken = (token) => {
    return jwt.verify(token, SECRET)
}
