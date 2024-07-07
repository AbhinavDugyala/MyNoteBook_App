import React, { useContext, useState } from 'react';
import { TextField, Button, InputAdornment, InputLabel, OutlinedInput, FormControl, IconButton, FormHelperText } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Link, useNavigate } from "react-router-dom";
import Alertss from "./Alertss"; // Assuming this is correctly imported from your project
import { AlertContext } from '../context/AlertContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
    const { showAlert } = useContext(AlertContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const loginSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, "Username should be at least 3 characters")
            .max(25, "Username should not exceed 25 characters")
            .required("Username is required")
            .matches(/^[a-z0-9]+$/i, "Username should contain only alphabets and numbers"),
        password: Yup.string()
            .required("Password is required")
            .min(4, "Password should be at least 4 characters")
            .matches(/^[a-z0-9]+$/i, "Password should contain only alphabets and numbers")
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch("https://notebook-app-plre.onrender.com/api/auth/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                });
                const json = await response.json();

                if (json.success) {
                    localStorage.setItem("token", json.authToken);
                    navigate(`/`);
                    showAlert(`Welcome back ${values.username}`, "success");
                } else {
                    showAlert(json.message, "error");
                }
            } catch (error) {
                console.error('Error during login:', error);
                showAlert("An error occurred during login. Please try again later.", "error");
            }
        }
    });

    const { errors, touched, handleSubmit, getFieldProps } = formik;

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <Alertss />
            <div className="container mt-5 addnotes">
                <Button className="mb-4" variant="text" color="secondary" startIcon={<ArrowBackIcon />} component={Link} to="/" style={{ textTransform: "none", fontFamily: "'Poppins', sans-serif" }}>Home</Button>
                <h2 style={{ fontWeight: "bold" }}>Login</h2>
                <p className="mb-4">Sign in on the internal platform</p>
                <div className="d-flex">
                    <Button size="large" fullWidth className="mb-4 me-4" variant="contained" color="primary" startIcon={<FacebookIcon />} style={{ textTransform: "none", fontSize: "1.1rem", color: "white", fontFamily: "'Poppins', sans-serif" }}>Login with Facebook</Button>
                    <Button size="large" fullWidth className="mb-4" variant="contained" color="error" startIcon={<GoogleIcon />} style={{ textTransform: "none", fontSize: "1.1rem", color: "white", fontFamily: "'Poppins', sans-serif" }}>Login with Google</Button>
                </div>
                <p className="mb-4 d-flex justify-content-center">or login with username and password</p>
                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <TextField
                            {...getFieldProps('username')}
                            color="secondary" label="Username" variant="outlined" fullWidth
                            error={Boolean(touched.username && errors.username)}
                            helperText={touched.username && errors.username}
                        />
                    </div>
                    <div className="mb-4">
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel color="secondary" htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                color="secondary"
                                type={showPassword ? 'text' : 'password'}
                                {...getFieldProps('password')}
                                error={Boolean(touched.password && errors.password)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            <FormHelperText error={Boolean(touched.password && errors.password)} id="outlined-weight-helper-text">{touched.password && errors.password}</FormHelperText>
                        </FormControl>
                    </div>
                    <Button type="submit" fullWidth size="large" className="mb-4" variant="contained" color="secondary" style={{ textTransform: "none", fontFamily: "'Poppins', sans-serif", fontSize: "1.1rem" }}>Login</Button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
}

export default Login;
