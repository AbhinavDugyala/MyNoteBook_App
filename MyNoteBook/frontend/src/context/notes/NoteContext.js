import { createContext, useContext, useState } from 'react'
import { apiFetch, ApiError } from '../../lib/api'
import { isLocalToken } from '../../config'
import { localAddNote, localEditNote, localGetNotes, localRemoveNote } from '../../lib/localStore'
import { AuthContext } from '../AuthContext'

export const NoteContext = createContext()

export function NoteProvider(props) {
    const auth = useContext(AuthContext)
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(false)

    const handleAuthError = (err) => {
        if (err instanceof ApiError && err.status === 401 && auth?.logout) {
            auth.logout()
        }
    }

    const getNotes = async () => {
        setLoading(true)
        try {
            if (isLocalToken()) {
                setNotes(localGetNotes())
                return
            }
            const json = await apiFetch('/api/notes/')
            setNotes(Array.isArray(json) ? json : [])
        } catch (err) {
            handleAuthError(err)
            if (isLocalToken() || !(err instanceof ApiError)) {
                setNotes(localGetNotes())
            } else {
                setNotes([])
            }
        } finally {
            setLoading(false)
        }
    }

    const add = async (newNote) => {
        if (isLocalToken()) {
            const created = localAddNote(newNote)
            setNotes(prev => [created, ...prev])
            return created
        }
        try {
            const json = await apiFetch('/api/notes/', {
                method: 'POST',
                body: JSON.stringify(newNote),
            })
            setNotes(prev => [json, ...prev])
            return json
        } catch (err) {
            handleAuthError(err)
            throw err
        }
    }

    const remove = async (removeId) => {
        if (isLocalToken()) {
            localRemoveNote(removeId)
            setNotes(prev => prev.filter(note => note._id !== removeId))
            return
        }
        try {
            await apiFetch(`/api/notes/${removeId}`, { method: 'DELETE' })
            setNotes(prev => prev.filter(note => note._id !== removeId))
        } catch (err) {
            handleAuthError(err)
            throw err
        }
    }

    const edit = async (title, description, tag, id) => {
        if (isLocalToken()) {
            const updated = localEditNote(id, { title, description, tag })
            setNotes(prev => prev.map(note => note._id === id ? updated : note))
            return updated
        }
        try {
            const json = await apiFetch(`/api/notes/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ title, description, tag }),
            })
            setNotes(prev => prev.map(note => note._id === id ? json : note))
            return json
        } catch (err) {
            handleAuthError(err)
            throw err
        }
    }

    return (
        <NoteContext.Provider value={{ notes, add, remove, edit, getNotes, loading }}>
            {props.children}
        </NoteContext.Provider>
    )
}
