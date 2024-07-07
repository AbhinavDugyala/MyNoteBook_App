// const express = require("express");
// const {createUser, loginUser, getUser, forgotPassword, resetPassword} = require('../controllers/auth')
// const {validateUserRegister, validateUserLogin, fetchUser} = require('../middlewares')
// const catchAsync = require('../utils/catchAsync')


// const router = express.Router()

// // Create a new user using: POST /api/auth/createuser "no login required"
// router.post('/createuser', validateUserRegister, catchAsync(createUser))

// // authenticate a user using: POST /api/auth/login "no login required"
// router.post('/login', validateUserLogin, catchAsync(loginUser))

// // get logged in user details using: POST /api/auth/getuser "login required"
// router.post('/getuser',fetchUser, catchAsync(getUser))

// // get logged in user details using: POST /api/auth/getuser "login required"
// router.post('/forgotpassword', catchAsync(forgotPassword))

// // get logged in user details using: POST /api/auth/getuser "login required"
// router.put('/resetpassword/:resetToken', catchAsync(resetPassword))

// module.exports = router

const express = require("express");
const passport = require('passport');
const { createUser, loginUser, getUser, forgotPassword, resetPassword } = require('../controllers/auth');
const { validateUserRegister, validateUserLogin, fetchUser } = require('../middlewares');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Create a new user using: POST /api/auth/createuser "no login required"
router.post('/createuser', validateUserRegister, catchAsync(createUser));

// Authenticate a user using: POST /api/auth/login "no login required"
router.post('/login', validateUserLogin, catchAsync(loginUser));

// Get logged-in user details using: POST /api/auth/getuser "login required"
router.post('/getuser', fetchUser, catchAsync(getUser));

// Forgot password using: POST /api/auth/forgotpassword "no login required"
router.post('/forgotpassword', catchAsync(forgotPassword));

// Reset password using: PUT /api/auth/resetpassword/:resetToken "no login required"
router.put('/resetpassword/:resetToken', catchAsync(resetPassword));

// Google OAuth routes
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         res.redirect('/');
//     }
// );

// Facebook OAuth routes
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
//     (req, res) => {
//         res.redirect('/');
//     }
// );

module.exports = router;
