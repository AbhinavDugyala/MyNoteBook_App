module.exports = function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
    }
}
