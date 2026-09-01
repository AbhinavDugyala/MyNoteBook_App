import React, { useContext, memo, useState } from 'react'
import { IconButton, useMediaQuery } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { NoteContext } from '../context/notes/NoteContext'
import { AlertContext } from '../context/AlertContext'
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useInputState from '../hooks/useInputState'
import useToggleState from '../hooks/useToggleState'

function formatDate(value) {
    if (!value) return ''
    try {
        return new Date(value).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        })
    } catch {
        return ''
    }
}

function NoteItem({ note }) {
    const { remove, edit } = useContext(NoteContext)
    const { showAlert } = useContext(AlertContext)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const [open, toggleOpen] = useToggleState(false)
    const [viewOpen, toggleView] = useToggleState(false)
    const [confirmOpen, toggleConfirm] = useToggleState(false)
    const [saving, setSaving] = useState(false)

    const [title, updateTitle] = useInputState(note.title)
    const [description, updateDescription] = useInputState(note.description)
    const [tag, updateTag] = useInputState(note.tag)

    const text = note.description || ''
    const preview = text.length > 160 ? `${text.slice(0, 160)}…` : text

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaving(true)
        try {
            await edit(title, description, tag, note._id)
            showAlert(`Updated “${title}”`, 'success')
            toggleOpen()
        } catch (err) {
            showAlert(err.message || 'Could not update this note', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            await remove(note._id)
            showAlert(`Deleted “${note.title}”`, 'success')
            toggleConfirm()
        } catch (err) {
            showAlert(err.message || 'Could not delete this note', 'error')
        }
    }

    return (
        <div className="col-12 col-sm-6 col-xl-4 mt-2 mb-3">
            <Dialog open={viewOpen} onClose={toggleView} fullScreen={fullScreen} fullWidth maxWidth="sm">
                <DialogTitle className="note-dialog-title">{note.title}</DialogTitle>
                <DialogContent>
                    <p className="note-dialog-tag">{note.tag}</p>
                    <p className="note-dialog-date">{formatDate(note.updatedAt || note.createdAt)}</p>
                    <p className="note-dialog-body">{text}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleView} color="secondary" style={{ textTransform: 'none' }}>Close</Button>
                    <Button onClick={() => { toggleView(); toggleOpen() }} variant="contained" color="secondary" style={{ textTransform: 'none' }}>Edit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={toggleOpen} fullScreen={fullScreen} fullWidth maxWidth="sm">
                <DialogTitle className="note-dialog-title">Edit note</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText className="note-dialog-help">
                            Update the fields you want to change. Title, description, and tag each need at least 3 characters.
                        </DialogContentText>
                        <TextField required color="secondary" margin="dense" value={title} onChange={updateTitle} label="Title" type="text" fullWidth variant="standard" />
                        <TextField required color="secondary" margin="dense" value={description} onChange={updateDescription} label="Description" type="text" fullWidth variant="standard" multiline minRows={4} />
                        <TextField required color="secondary" margin="dense" value={tag} onChange={updateTag} label="Tag" type="text" fullWidth variant="standard" />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="secondary" onClick={toggleOpen} style={{ textTransform: 'none' }}>Cancel</Button>
                        <Button
                            disabled={saving || title.trim().length < 3 || description.trim().length < 3 || tag.trim().length < 3}
                            variant="contained"
                            color="secondary"
                            type="submit"
                            style={{ textTransform: 'none' }}
                        >
                            {saving ? 'Saving…' : 'Save changes'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={confirmOpen} onClose={toggleConfirm} fullWidth maxWidth="xs">
                <DialogTitle>Delete this note?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        “{note.title}” will be removed. This cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleConfirm} color="secondary" style={{ textTransform: 'none' }}>Keep</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" style={{ textTransform: 'none' }}>Delete</Button>
                </DialogActions>
            </Dialog>

            <article className="note-card">
                <div className="note-card-top">
                    <span className="note-tag">{note.tag || 'General'}</span>
                    <div className="note-actions">
                        <IconButton aria-label={`View ${note.title}`} onClick={toggleView} color="secondary" size="small">
                            <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label={`Edit ${note.title}`} onClick={toggleOpen} color="secondary" size="small">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label={`Delete ${note.title}`} onClick={toggleConfirm} color="secondary" size="small">
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                    </div>
                </div>
                <h3 className="note-title">{note.title}</h3>
                <p className="note-preview">{preview || 'No description yet.'}</p>
                <p className="note-date">{formatDate(note.updatedAt || note.createdAt)}</p>
            </article>
        </div>
    )
}

export default memo(NoteItem)
