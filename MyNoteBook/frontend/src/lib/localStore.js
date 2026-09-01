const USERS_KEY = 'mynotebook.users'
const NOTES_KEY = 'mynotebook.notes'
const USER_KEY = 'mynotebook.user'

export function uid() {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

function hashPassword(password) {
    let hash = 0
    const value = `${password}::mynotebook-local`
    for (let i = 0; i < value.length; i += 1) {
        hash = Math.imul(31, hash) + value.charCodeAt(i) | 0
    }
    return String(hash)
}

function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function getLocalUsers() {
    return readJson(USERS_KEY, [])
}

export function saveLocalUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getLocalUser() {
    return readJson(USER_KEY, null)
}

export function clearLocalSession() {
    localStorage.removeItem('token')
    localStorage.removeItem(USER_KEY)
}

export function localRegister({ username, email, password }) {
    const users = getLocalUsers()
    const takenUser = users.find(user => user.username.toLowerCase() === username.toLowerCase())
    if (takenUser) {
        return { ok: false, message: 'An account with that username already exists' }
    }
    const takenEmail = users.find(user => user.email.toLowerCase() === email.toLowerCase())
    if (takenEmail) {
        return { ok: false, message: 'An account with that email already exists' }
    }

    const user = {
        id: uid(),
        username,
        email,
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
    }
    users.push(user)
    writeJson(USERS_KEY, users)

    const publicUser = { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt }
    const token = `local.${user.id}.${uid()}`
    localStorage.setItem('token', token)
    saveLocalUser(publicUser)
    return { ok: true, user: publicUser, authToken: token }
}

export function localLogin({ username, password }) {
    const users = getLocalUsers()
    const user = users.find(item => item.username.toLowerCase() === username.toLowerCase())
    if (!user || user.password !== hashPassword(password)) {
        return { ok: false, message: 'Invalid username or password' }
    }
    const publicUser = { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt }
    const token = `local.${user.id}.${uid()}`
    localStorage.setItem('token', token)
    saveLocalUser(publicUser)
    return { ok: true, user: publicUser, authToken: token }
}

export function localForgotPassword(email) {
    const users = getLocalUsers()
    const user = users.find(item => item.email.toLowerCase() === email.toLowerCase())
    if (!user) {
        return { ok: false, message: 'No account found with that email. Please register first.' }
    }
    const resetToken = uid()
    user.resetToken = resetToken
    user.resetExpire = Date.now() + 10 * 60 * 1000
    writeJson(USERS_KEY, users)
    return {
        ok: true,
        message: 'Use the reset link below (valid for 10 minutes).',
        resetUrl: `/reset-password/${resetToken}`,
    }
}

export function localResetPassword(resetToken, password) {
    const users = getLocalUsers()
    const user = users.find(item => item.resetToken === resetToken && item.resetExpire > Date.now())
    if (!user) {
        return { ok: false, message: 'This reset link is invalid or has expired' }
    }
    user.password = hashPassword(password)
    user.resetToken = undefined
    user.resetExpire = undefined
    writeJson(USERS_KEY, users)
    return { ok: true, message: 'Password updated. You can sign in now.' }
}

function allNotes() {
    return readJson(NOTES_KEY, [])
}

function currentUserId() {
    const user = getLocalUser()
    if (user?.id) return user.id
    const token = localStorage.getItem('token') || ''
    const parts = token.split('.')
    return parts[1] || null
}

export function localGetNotes() {
    const userId = currentUserId()
    return allNotes()
        .filter(note => note.user === userId)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function localAddNote({ title, description, tag }) {
    const notes = allNotes()
    const now = new Date().toISOString()
    const note = {
        _id: uid(),
        title,
        description,
        tag: tag || 'General',
        user: currentUserId(),
        createdAt: now,
        updatedAt: now,
    }
    notes.unshift(note)
    writeJson(NOTES_KEY, notes)
    return note
}

export function localEditNote(id, { title, description, tag }) {
    const notes = allNotes()
    const index = notes.findIndex(note => note._id === id && note.user === currentUserId())
    if (index === -1) {
        throw new Error('Note not found')
    }
    notes[index] = {
        ...notes[index],
        title,
        description,
        tag,
        updatedAt: new Date().toISOString(),
    }
    writeJson(NOTES_KEY, notes)
    return notes[index]
}

export function localRemoveNote(id) {
    const notes = allNotes()
    const next = notes.filter(note => !(note._id === id && note.user === currentUserId()))
    writeJson(NOTES_KEY, next)
}
