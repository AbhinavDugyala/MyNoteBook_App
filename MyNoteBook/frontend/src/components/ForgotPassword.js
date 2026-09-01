import React, { useContext, useState } from 'react'
import { TextField, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AlertContext } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import Layout from './Layout'

function ForgotPassword() {
    const { showAlert } = useContext(AlertContext)
    const { forgotPassword } = useAuth()
    const [resetUrl, setResetUrl] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Enter a valid email').required('Email is required'),
        }),
        onSubmit: async (values) => {
            setSubmitting(true)
            setResetUrl('')
            const result = await forgotPassword(values.email)
            setSubmitting(false)
            if (result.ok) {
                showAlert(result.message || 'Check your email for a reset link', 'success')
                if (result.resetUrl) setResetUrl(result.resetUrl)
            } else {
                showAlert(result.message || 'Could not start a password reset', 'error')
            }
        }
    })

    const { errors, touched, handleSubmit, getFieldProps } = formik
    const resetPath = resetUrl.startsWith('http') ? new URL(resetUrl).pathname : resetUrl

    return (
        <Layout>
            <div className="container auth-page">
                <div className="auth-card">
                    <p className="eyebrow">Account recovery</p>
                    <h1>Forgot password</h1>
                    <p className="form-lead">Enter the email on your account. We will generate a reset link that stays valid for 10 minutes.</p>
                    <form autoComplete="off" noValidate onSubmit={handleSubmit} className="auth-form">
                        <TextField
                            {...getFieldProps('email')}
                            type="email"
                            color="secondary"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <Button
                            type="submit"
                            disabled={submitting}
                            fullWidth
                            size="large"
                            variant="contained"
                            color="secondary"
                            style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem' }}
                        >
                            {submitting ? 'Sending…' : 'Send reset link'}
                        </Button>
                    </form>
                    {resetUrl && (
                        <div className="reset-box">
                            <p>Email delivery is not set up here, so use this link:</p>
                            <Link to={resetPath}>Open password reset</Link>
                        </div>
                    )}
                    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
                </div>
            </div>
        </Layout>
    )
}

export default ForgotPassword
