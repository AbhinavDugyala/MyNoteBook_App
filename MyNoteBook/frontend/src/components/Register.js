import React, { useContext, useState } from 'react'
import { TextField, Button, InputAdornment, InputLabel, OutlinedInput, FormControl, IconButton, FormHelperText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from "react-router-dom";
import avataars from "../images/avataars.png"
import Alertss from "./Alertss";
import { AlertContext } from '../context/AlertContext';
import { useFormik } from 'formik'
import * as Yup from 'yup';

function Register() {

    const { showAlert } = useContext(AlertContext)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const registerSchema = Yup.object().shape({
        username: Yup.string().required().min(3).max(25).matches(/^[a-z0-9]+$/i, "Username should contain alphabets and numbers only"),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(4).matches(/^[a-z0-9]+$/i, "Password should contain alphabets and numbers only"),
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            const {username, email, password} = values
            const response = await fetch("https://notebook-app-plre.onrender.com/api/auth/createuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, email, password})
            })
            const json = await response.json()
            console.log(json)
            if (json.success) {
                navigate("/login")
            } else {
                showAlert(json.message, "error")
            }
        }
    })

    const { errors, touched, handleSubmit, getFieldProps } = formik;

    return (
        <div>
            <Alertss />
            <div className="d-flex">
                <div className="col-md-5">
                    <img className="img-fluid" src={avataars} alt="register" style={{ width: "100%", height: "100vh", objectFit: "cover", marginLeft:"10px", marginRight:"10px"}} />
                </div>

                <div className="col-md-7 ps-5 pe-5 pt-5" style={{ width: "50%" }}>
                    <Button className="mb-4" variant="text" color="secondary" startIcon={<ArrowBackIcon />} component={Link} to="/" style={{ textTransform: "none", fontFamily: "'Poppins', sans-serif" }}>Home</Button>
                    <h2 style={{ fontWeight: "Bold" }}>Create a new account</h2>
                    <p className="mb-4">Use your email to create a new account</p>
                    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <TextField {...getFieldProps('username')}
                                error={Boolean(touched.username && errors.username)}
                                helperText={touched.username && errors.username}
                                color="secondary" label="Username" variant="outlined" fullWidth />
                        </div>
                        <div className="mb-4">
                            <TextField {...getFieldProps('email')}
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                                type="email" color="secondary" label="Email" variant="outlined" fullWidth />
                        </div>
                        <div className="mb-2">
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel color="secondary" error={Boolean(touched.password && errors.password)} htmlFor="outlined-adornment-password">Password</InputLabel>
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
                                    label="Password" />
                                <FormHelperText error={Boolean(touched.password && errors.password)} id="outlined-weight-helper-text">{touched.password && errors.password}</FormHelperText>
                            </FormControl>
                        </div>
                        <Button type="submit" fullWidth size="large" className="mb-4" variant="contained" color="secondary" style={{ textTransform: "none", fontFamily: "'Poppins', sans-serif", fontSize: "1.1rem" }}>Register now</Button>
                    </form>
                    <p>Have an account? <Link to="/login" >login</Link> </p>
                </div>
            </div>
        </div>
    )
}

export default Register

// import React, { useContext, useState } from 'react';
// import { TextField, Button, InputAdornment, InputLabel, OutlinedInput, FormControl, IconButton, FormHelperText } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import GoogleIcon from '@mui/icons-material/Google';
// import { Link, useNavigate } from "react-router-dom";
// import avataars from "../images/avataars.png";
// import Alertss from "./Alertss";
// import { AlertContext } from '../context/AlertContext';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// function Register() {
//     const { showAlert } = useContext(AlertContext);
//     const navigate = useNavigate();
//     const [showPassword, setShowPassword] = useState(false);

//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };

//     const handleMouseDownPassword = (event) => {
//         event.preventDefault();
//     };

//     const registerSchema = Yup.object().shape({
//         username: Yup.string().required().min(3).max(25).matches(/^[a-z0-9]+$/i, "Username should contain alphabets and numbers only"),
//         email: Yup.string().email().required(),
//         password: Yup.string().required().min(4).matches(/^[a-z0-9]+$/i, "Password should contain alphabets and numbers only"),
//     });

//     const formik = useFormik({
//         initialValues: {
//             username: "",
//             email: "",
//             password: "",
//         },
//         validationSchema: registerSchema,
//         onSubmit: async (values) => {
//             const {username, email, password} = values;
//             const response = await fetch("http://localhost:8080/api/auth/createuser", {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({username, email, password})
//             });
//             const json = await response.json();
//             console.log(json);
//             if (json.success) {
//                 navigate("/login");
//             } else {
//                 showAlert(json.message, "error");
//             }
//         }
//     });

//     const { errors, touched, handleSubmit, getFieldProps } = formik;

//     return (
//         <div>
//             <Alertss />
//             <div className="d-flex">
//                 <div className="col-md-5">
//                     <img className="img-fluid" src={avataars} alt="register" style={{ width: "100%", height: "100vh", objectFit: "cover" }} />
//                 </div>

//                 <div className="col-md-7 ps-5 pe-5 pt-5" style={{ width: "50%" }}>
//                     <Button className="mb-4" variant="text" color="secondary" startIcon={<ArrowBackIcon />} component={Link} to="/" style={{ textTransform: "none", fontFamily: "'Poppins', sans-serif" }}>Home</Button>
//                     <h2 style={{ fontWeight: "Bold" }}>Create a new account</h2>
//                     <p className="mb-4">Use your email to create a new Account.</p>
//                     <form autoComplete="off" noValidate onSubmit={handleSubmit}>
//                         <div className="mb-4">
//                             <TextField {...getFieldProps('username')}
//                                 error={Boolean(touched.username && errors.username)}
//                                 helperText={touched.username && errors.username}
//                                 color="secondary" label="Username" variant="outlined" fullWidth />
//                         </div>
//                         <div className="mb-4">
//                             <TextField {...getFieldProps('email')}
//                                 error={Boolean(touched.email && errors.email)}
//                                 helperText={touched.email && errors.email}
//                                 type="email" color="secondary" label="Email" variant="outlined" fullWidth />
//                         </div>
//                         <div className="mb-2">
//                             <FormControl variant="outlined" fullWidth>
//                                 <InputLabel color="secondary" error={Boolean(touched.password && errors.password)} htmlFor="outlined-adornment-password">Password</InputLabel>
//                                 <OutlinedInput
//                                     id="outlined-adornment-password"
//                                     color="secondary"
//                                     type={showPassword ? 'text' : 'password'}
//                                     {...getFieldProps('password')}
//                                     error={Boolean(touched.password && errors.password)}
//                                     endAdornment={
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 aria-label="toggle password visibility"
//                                                 onClick={handleClickShowPassword}
//                                                 onMouseDown={handleMouseDownPassword}
//                                                 edge="end"
//                                             >
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     }
//                                     label="Password" />
//                                 <FormHelperText error={Boolean(touched.password && errors.password)} id="outlined-weight-helper-text">{touched.password && errors.password}</FormHelperText>
//                             </FormControl>
//                         </div>
//                         <Button type="submit" fullWidth size="large" className="mb-4" variant="contained" color="secondary" style={{ textTransform: "none", fontFamily: "'Poppins', sans-serif", fontSize: "1.1rem" }}>Register now</Button>
//                     </form>
//                     <p>Have an account? <Link to="/login" >login</Link> </p>
//                     {/* <div className="d-flex">
//                         <Button size="large" fullWidth className="mb-4 me-4" variant="contained" color="primary" startIcon={<FacebookIcon />} href="/auth/facebook" style={{ textTransform: "none", fontSize: "1.1rem", color: "White", fontFamily: "'Poppins', sans-serif" }}>
//                             Sign up with Facebook
//                         </Button>
//                         <Button size="large" fullWidth className="mb-4" variant="contained" color="error" startIcon={<GoogleIcon />} href="/auth/google" style={{ textTransform: "none", fontSize: "1.1rem", color: "White", fontFamily: "'Poppins', sans-serif" }}>
//                             Sign up with Google
//                         </Button>
//                     </div> */}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Register;

