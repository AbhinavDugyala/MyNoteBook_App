import React, { useContext, useState } from 'react'
import { TextField, Button, InputAdornment, InputLabel, OutlinedInput, FormControl, IconButton, FormHelperText } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { AlertContext } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Layout from './Layout'

function Login() {
    const { showAlert } = useContext(AlertContext)
    const { login } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const loginSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, 'Username should be at least 3 characters')
            .max(25, 'Username should not exceed 25 characters')
            .required('Username is required')
            .matches(/^[a-z0-9]+$/i, 'Username should contain only letters and numbers'),
        password: Yup.string()
            .required('Password is required')
            .min(5, 'Password should be at least 5 characters'),
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            setSubmitting(true)
            const result = await login(values)
            setSubmitting(false)
            if (result.ok) {
                navigate('/')
                showAlert(`Welcome back, ${values.username}`, 'success')
            } else {
                showAlert(result.message || 'Could not sign in', 'error')
            }
        }
    })

    const { errors, touched, handleSubmit, getFieldProps } = formik

    return (
        <Layout>
            <div className="container auth-page">
                <div className="auth-card">
                    <p className="eyebrow">Welcome back</p>
                    <h1>Sign in</h1>
                    <p className="form-lead">Use the username and password you created for myNoteBook.</p>
                    <form autoComplete="off" noValidate onSubmit={handleSubmit} className="auth-form">
                        <TextField
                            {...getFieldProps('username')}
                            color="secondary"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            error={Boolean(touched.username && errors.username)}
                            helperText={touched.username && errors.username}
                        />
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel color="secondary" htmlFor="login-password">Password</InputLabel>
                            <OutlinedInput
                                id="login-password"
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
                        <div className="auth-row">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                        <Button
                            type="submit"
                            disabled={submitting}
                            fullWidth
                            size="large"
                            variant="contained"
                            color="secondary"
                            style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem' }}
                        >
                            {submitting ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </form>
                    <p className="auth-switch">Don&apos;t have an account? <Link to="/register">Create one</Link></p>
                </div>
            </div>
        </Layout>
    )
}

export default Login
