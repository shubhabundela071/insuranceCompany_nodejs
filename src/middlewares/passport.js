'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/users');
module.exports = function(passport) {

  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  opts.secretOrKey = CONFIG.jwt_encryption;
  opts.passReqToCallback = true;

  passport.use(new JwtStrategy(opts, async function(req, jwt_payload, done) {
    let token = req.headers.authorization.split(' ')[1];
    let auth_token;

//Check token 
    auth_token = await User.query().where('token', token).andWhere('id', jwt_payload.userId).first() || await Admin.query().where('token', token).andWhere('id', jwt_payload.userId).first();
    if (auth_token) {
      delete auth_token.password;
      return done(null, auth_token);
    } else {
      return done(null, false);
    }

  }));
}
