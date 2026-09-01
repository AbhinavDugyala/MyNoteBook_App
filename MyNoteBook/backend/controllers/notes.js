const Notes = require('../models/Notes')
const ExpressError = require('../utils/ExpressError')
const offline = require('../store/offline')

module.exports.fetchAllNotes = async (req, res) => {
    if (!offline.isDbReady()) return offline.fetchAllNotes(req, res)
    const notes = await Notes.find({ user: req.user.id }).sort({ updatedAt: -1 })
    res.status(200).json(notes)
}

module.exports.addNote = async (req, res) => {
    if (!offline.isDbReady()) return offline.addNote(req, res)
    const { title, description, tag } = req.body
    const notes = new Notes({
        title,
        description,
        tag: tag || 'General',
        user: req.user.id
    })
    const resp = await notes.save()
    res.status(201).json(resp)
}

module.exports.updateNote = async (req, res) => {
    if (!offline.isDbReady()) return offline.updateNote(req, res)
    const { id } = req.params
    const userId = req.user.id
    const note = await Notes.findById(id)
    if (!note) {
        throw new ExpressError('Note not found', 404)
    }
    if (note.user.toString() !== userId) {
        throw new ExpressError('Unauthorized access', 401)
    }
    const updatedNote = await Notes.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true })
    res.status(200).json(updatedNote)
}

module.exports.deleteNote = async (req, res) => {
    if (!offline.isDbReady()) return offline.deleteNote(req, res)
    const { id } = req.params
    const userId = req.user.id
    const note = await Notes.findById(id)
    if (!note) {
        throw new ExpressError('Note not found', 404)
    }
    if (note.user.toString() !== userId) {
        throw new ExpressError('Unauthorized access', 401)
    }
    const deletedNote = await Notes.findByIdAndDelete(id)
    res.status(200).json({ success: true, message: `${deletedNote.title} deleted successfully`, note: deletedNote })
}
