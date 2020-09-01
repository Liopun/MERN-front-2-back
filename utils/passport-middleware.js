const passport      = require('passport'),
      bcrypt        = require('bcrypt'),
      mongoose      = require('mongoose'),
      JwtStrategy   = require('passport-jwt').Strategy,
      ExtractJwt    = require('passport-jwt').ExtractJwt

const config        = require('../config/keys.js'),
      Auth          = require('../models/auth-model.js')

var options = {}
options.jwtFromRequest = (req) => req.signedCookies['jwtToken'] || req.cookies.jwtToken
options.secretOrKey = config.secretOrKey

// JwtStrategy for request authentication
passport.use(new JwtStrategy(options, async (jwtPayLoad, done) => {
    try {
        let user = await Auth.findById(jwtPayLoad.sub ? jwtPayLoad.sub : jwtPayLoad.id)

        if(!user) {
            console.log('User not found in db')
            return done(null, false)
        }

        if(Date.now() > jwtPayLoad.expires) return done('jwt expired.')

        return done(null, jwtPayLoad)
    } catch (err) {
        console.error("::::=", err.message)
        return done(null, false)
    }
}))

// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// })

// passport.deserializeUser((id, done) => {
// 	mongoose.models.user.findOne(id, (err, user) => {
// 		done(err, user);
//     })
// });