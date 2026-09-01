import React, { useContext, useState } from 'react'
import { TextField, Button } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AlertContext } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import Layout from './Layout'

function ResetPassword() {
    const { resetToken } = useParams()
    const { showAlert } = useContext(AlertContext)
    const { resetPassword } = useAuth()
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)

    const formik = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            password: Yup.string().min(5, 'Password should be at least 5 characters').required('Password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm your password'),
        }),
        onSubmit: async (values) => {
            setSubmitting(true)
            const result = await resetPassword(resetToken, values.password)
            setSubmitting(false)
            if (result.ok) {
                showAlert(result.message || 'Password updated', 'success')
                navigate('/login')
            } else {
                showAlert(result.message || 'Could not reset your password', 'error')
            }
        }
    })

    const { errors, touched, handleSubmit, getFieldProps } = formik

    return (
        <Layout>
            <div className="container auth-page">
                <div className="auth-card">
                    <p className="eyebrow">Choose a new password</p>
                    <h1>Reset password</h1>
                    <p className="form-lead">Pick something memorable that is at least 5 characters.</p>
                    <form autoComplete="off" noValidate onSubmit={handleSubmit} className="auth-form">
                        <TextField
                            {...getFieldProps('password')}
                            type="password"
                            color="secondary"
                            label="New password"
                            variant="outlined"
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                        />
                        <TextField
                            {...getFieldProps('confirmPassword')}
                            type="password"
                            color="secondary"
                            label="Confirm password"
                            variant="outlined"
                            fullWidth
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
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
                            {submitting ? 'Updating…' : 'Update password'}
                        </Button>
                    </form>
                    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
                </div>
            </div>
        </Layout>
    )
}

export default ResetPassword
