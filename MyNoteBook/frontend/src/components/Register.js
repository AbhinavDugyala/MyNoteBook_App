import React, { useContext, useState } from 'react'
import { TextField, Button, InputAdornment, InputLabel, OutlinedInput, FormControl, IconButton, FormHelperText } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Link, useNavigate } from 'react-router-dom'
import avataars from '../images/avataars.png'
import { AlertContext } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Layout from './Layout'

function Register() {
    const { showAlert } = useContext(AlertContext)
    const { register } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const registerSchema = Yup.object().shape({
        username: Yup.string().required('Username is required').min(3).max(25).matches(/^[a-z0-9]+$/i, 'Username should contain letters and numbers only'),
        email: Yup.string().email('Enter a valid email').required('Email is required'),
        password: Yup.string().required('Password is required').min(5, 'Password should be at least 5 characters'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm your password'),
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            setSubmitting(true)
            const { username, email, password } = values
            const result = await register({ username, email, password })
            setSubmitting(false)
            if (result.ok) {
                navigate('/')
                showAlert(`Welcome, ${username}. Your notebook is ready.`, 'success')
            } else {
                showAlert(result.message || 'Could not create your account', 'error')
            }
        }
    })

    const { errors, touched, handleSubmit, getFieldProps } = formik

    return (
        <Layout>
            <div className="auth-split">
                <div className="auth-split-art d-none d-lg-block">
                    <img src={avataars} alt="Illustration for creating a myNoteBook account" />
                </div>
                <div className="auth-split-form">
                    <div className="auth-card auth-card-wide">
                        <p className="eyebrow">New here</p>
                        <h1>Create your account</h1>
                        <p className="form-lead">Use your email so you can get back in if you forget your password.</p>
                        <form autoComplete="off" noValidate onSubmit={handleSubmit} className="auth-form">
                            <TextField
                                {...getFieldProps('username')}
                                error={Boolean(touched.username && errors.username)}
                                helperText={touched.username && errors.username}
                                color="secondary"
                                label="Username"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                {...getFieldProps('email')}
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                                type="email"
                                color="secondary"
                                label="Email"
                                variant="outlined"
                                fullWidth
                            />
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel color="secondary" error={Boolean(touched.password && errors.password)} htmlFor="register-password">Password</InputLabel>
                                <OutlinedInput
                                    id="register-password"
                                    color="secondary"
                                    type={showPassword ? 'text' : 'password'}
                                    {...getFieldProps('password')}
                                    error={Boolean(touched.password && errors.password)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} onMouseDown={(event) => event.preventDefault()} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                                <FormHelperText error={Boolean(touched.password && errors.password)}>
                                    {touched.password && errors.password}
                                </FormHelperText>
                            </FormControl>
                            <TextField
                                {...getFieldProps('confirmPassword')}
                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                                type={showPassword ? 'text' : 'password'}
                                color="secondary"
                                label="Confirm password"
                                variant="outlined"
                                fullWidth
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
                                {submitting ? 'Creating account…' : 'Create account'}
                            </Button>
                        </form>
                        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Register
