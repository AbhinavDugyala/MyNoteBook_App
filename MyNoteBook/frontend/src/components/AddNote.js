import React, { useContext, useState } from 'react'
import { NoteContext } from '../context/notes/NoteContext'
import { TextField, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useNavigate } from 'react-router-dom'
import { AlertContext } from '../context/AlertContext'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Layout from './Layout'
import '../styles/home.css'

function AddNote() {
    const { add } = useContext(NoteContext)
    const navigate = useNavigate()
    const { showAlert } = useContext(AlertContext)
    const [saving, setSaving] = useState(false)

    const noteSchema = Yup.object().shape({
        title: Yup.string().min(3, 'Title should be at least 3 characters').required('Title is required'),
        description: Yup.string().min(3, 'Description should be at least 3 characters').required('Description is required'),
        tag: Yup.string().min(3, 'Tag should be at least 3 characters').required('Tag is required'),
    })

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            tag: 'General',
        },
        validationSchema: noteSchema,
        onSubmit: async (values) => {
            setSaving(true)
            try {
                await add(values)
                showAlert(`Created “${values.title}”`, 'success')
                navigate('/')
            } catch (err) {
                showAlert(err.message || 'Could not save this note', 'error')
            } finally {
                setSaving(false)
            }
        }
    })

    const { errors, touched, handleSubmit, getFieldProps } = formik

    return (
        <Layout>
            <div className="container form-page">
                <Button className="mb-3" variant="text" color="secondary" startIcon={<ArrowBackIcon />} component={Link} to="/" style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif" }}>
                    Back to notes
                </Button>
                <h1>Create a new note</h1>
                <p className="form-lead">Give it a clear title and a tag so you can find it later.</p>
                <form autoComplete="off" noValidate onSubmit={handleSubmit} className="note-form">
                    <TextField
                        {...getFieldProps('title')}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                        color="secondary"
                        label="Title"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                        color="secondary"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={6}
                    />
                    <TextField
                        {...getFieldProps('tag')}
                        error={Boolean(touched.tag && errors.tag)}
                        helperText={touched.tag && errors.tag}
                        color="secondary"
                        label="Tag"
                        variant="outlined"
                        fullWidth
                        placeholder="Study, Work, Personal…"
                    />
                    <Button
                        type="submit"
                        disabled={saving}
                        fullWidth
                        size="large"
                        variant="contained"
                        color="secondary"
                        style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem' }}
                    >
                        {saving ? 'Saving…' : 'Add note'}
                    </Button>
                </form>
            </div>
        </Layout>
    )
}

export default AddNote
