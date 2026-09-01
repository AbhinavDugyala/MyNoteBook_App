const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const mongoose = require('mongoose')
const ExpressError = require('../utils/ExpressError')
const { signToken } = require('../utils/token')
const publicUser = require('../utils/publicUser')

const FILE = path.join(__dirname, '..', 'data', 'store.json')

function isDbReady() {
    return mongoose.connection.readyState === 1
}

function load() {
    try {
        return JSON.parse(fs.readFileSync(FILE, 'utf8'))
    } catch {
        return { users: [], notes: [] }
    }
}

function save(data) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

function newId() {
    return crypto.randomBytes(12).toString('hex')
}

function toPublic(user) {
    return publicUser({
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
    })
}

async function createUser(req, res) {
    const { username, email, password } = req.body
    const data = load()
    if (data.users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        throw new ExpressError('An account with that username already exists', 400)
    }
    if (data.users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        throw new ExpressError('An account with that email already exists', 400)
    }
    const user = {
        _id: newId(),
        username,
        email,
        password: await bcrypt.hash(password, 12),
        createdAt: new Date().toISOString(),
    }
    data.users.push(user)
    save(data)
    res.status(201).json({ success: true, user: toPublic(user), authToken: signToken({ _id: user._id }) })
}

async function loginUser(req, res) {
    const { username, password } = req.body
    const data = load()
    const user = data.users.find(item => item.username.toLowerCase() === username.toLowerCase())
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ExpressError('Invalid username or password', 400)
    }
    res.status(200).json({ success: true, user: toPublic(user), authToken: signToken({ _id: user._id }) })
}

async function getUser(req, res) {
    const data = load()
    const user = data.users.find(item => item._id === req.user.id)
    if (!user) throw new ExpressError('User not found', 404)
    res.status(200).json({ success: true, user: toPublic(user) })
}

async function forgotPassword(req, res) {
    const { email } = req.body
    if (!email) throw new ExpressError('Email is required', 400)
    const data = load()
    const user = data.users.find(item => item.email.toLowerCase() === email.toLowerCase())
    if (!user) throw new ExpressError('No account found with that email. Please register first.', 404)
    const resetToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    save(data)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`
    res.status(200).json({
        success: true,
        message: 'Email is not configured on this server. Use the reset link below (valid for 10 minutes).',
        resetUrl,
    })
}

async function resetPassword(req, res) {
    const { password } = req.body
    if (!password || password.length < 5) {
        throw new ExpressError('Password must be at least 5 characters', 400)
    }
    const hashed = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
    const data = load()
    const user = data.users.find(item => item.resetPasswordToken === hashed && item.resetPasswordExpire > Date.now())
    if (!user) throw new ExpressError('This reset link is invalid or has expired', 404)
    user.password = await bcrypt.hash(password, 12)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    save(data)
    res.status(200).json({ success: true, message: 'Password updated. You can sign in now.' })
}

async function fetchAllNotes(req, res) {
    const data = load()
    const notes = data.notes
        .filter(note => note.user === req.user.id)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    res.status(200).json(notes)
}

async function addNote(req, res) {
    const { title, description, tag } = req.body
    const data = load()
    const now = new Date().toISOString()
    const note = {
        _id: newId(),
        title,
        description,
        tag: tag || 'General',
        user: req.user.id,
        createdAt: now,
        updatedAt: now,
    }
    data.notes.unshift(note)
    save(data)
    res.status(201).json(note)
}

async function updateNote(req, res) {
    const data = load()
    const note = data.notes.find(item => item._id === req.params.id)
    if (!note) throw new ExpressError('Note not found', 404)
    if (note.user !== req.user.id) throw new ExpressError('Unauthorized access', 401)
    note.title = req.body.title
    note.description = req.body.description
    note.tag = req.body.tag
    note.updatedAt = new Date().toISOString()
    save(data)
    res.status(200).json(note)
}

async function deleteNote(req, res) {
    const data = load()
    const note = data.notes.find(item => item._id === req.params.id)
    if (!note) throw new ExpressError('Note not found', 404)
    if (note.user !== req.user.id) throw new ExpressError('Unauthorized access', 401)
    data.notes = data.notes.filter(item => item._id !== req.params.id)
    save(data)
    res.status(200).json({ success: true, message: `${note.title} deleted successfully`, note })
}

module.exports = {
    isDbReady,
    createUser,
    loginUser,
    getUser,
    forgotPassword,
    resetPassword,
    fetchAllNotes,
    addNote,
    updateNote,
    deleteNote,
}
