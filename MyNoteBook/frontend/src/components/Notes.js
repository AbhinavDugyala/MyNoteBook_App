import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, CircularProgress, TextField } from '@mui/material'
import { NoteContext } from '../context/notes/NoteContext'
import NoteItem from './NoteItem'

function Notes() {
    const { notes, getNotes, loading } = useContext(NoteContext)
    const [query, setQuery] = useState('')
    const [activeTag, setActiveTag] = useState('All')

    useEffect(() => {
        getNotes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const list = useMemo(() => (Array.isArray(notes) ? notes : []), [notes])
    const tags = useMemo(() => {
        const unique = Array.from(new Set(list.map(note => note.tag).filter(Boolean)))
        return ['All', ...unique]
    }, [list])

    const visible = list.filter((note) => {
        const haystack = `${note.title || ''} ${note.description || ''} ${note.tag || ''}`.toLowerCase()
        const matchesQuery = haystack.includes(query.trim().toLowerCase())
        const matchesTag = activeTag === 'All' || note.tag === activeTag
        return matchesQuery && matchesTag
    })

    return (
        <section className="notes-section">
            <div className="notes-toolbar">
                <div>
                    <h2>Your notes</h2>
                    <p className="notes-count">{list.length} saved {list.length === 1 ? 'note' : 'notes'}</p>
                </div>
                <TextField
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    label="Search notes"
                    variant="outlined"
                    color="secondary"
                    size="small"
                    className="notes-search"
                />
            </div>

            {tags.length > 1 && (
                <div className="tag-row" role="tablist" aria-label="Filter by tag">
                    {tags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            className={`tag-chip ${activeTag === tag ? 'is-active' : ''}`}
                            onClick={() => setActiveTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {loading && (
                <div className="notes-loading">
                    <CircularProgress color="secondary" size={32} />
                    <span>Fetching your notes…</span>
                </div>
            )}

            {!loading && visible.length === 0 && (
                <div className="empty-state">
                    <h3>{list.length === 0 ? 'Your notebook is empty' : 'No notes match that search'}</h3>
                    <p>
                        {list.length === 0
                            ? 'Write your first note and it will show up here, tagged and ready to edit.'
                            : 'Try another keyword or clear the tag filter.'}
                    </p>
                    {list.length === 0 && (
                        <Button
                            component={Link}
                            to="/new"
                            variant="contained"
                            color="secondary"
                            style={{ color: 'white', textTransform: 'none', fontFamily: "'Poppins', sans-serif" }}
                        >
                            Create your first note
                        </Button>
                    )}
                </div>
            )}

            <div className="row notes-grid">
                {visible.map(note => (
                    <NoteItem key={note._id} note={note} />
                ))}
            </div>
        </section>
    )
}

export default Notes
