// // utils/passport.js
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const User = require('../models/User');

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//     const newUser = {
//         googleId: profile.id,
//         username: profile.displayName,
//         email: profile.emails[0].value
//     };

//     try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (user) {
//             done(null, user);
//         } else {
//             user = await User.create(newUser);
//             done(null, user);
//         }
//     } catch (err) {
//         console.error(err);
//         done(err, false);
//     }
// }));

// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     callbackURL: "/auth/facebook/callback",
//     profileFields: ['id', 'displayName', 'emails']
// }, async (accessToken, refreshToken, profile, done) => {
//     const newUser = {
//         facebookId: profile.id,
//         username: profile.displayName,
//         email: profile.emails[0].value
//     };

//     try {
//         let user = await User.findOne({ facebookId: profile.id });

//         if (user) {
//             done(null, user);
//         } else {
//             user = await User.create(newUser);
//             done(null, user);
//         }
//     } catch (err) {
//         console.error(err);
//         done(err, false);
//     }
// }));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });
