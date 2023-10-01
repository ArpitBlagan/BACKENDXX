const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const userDB = require("../models/User");

passport.use(
  new StrategyJwt(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            (req) => req.cookies.jwt,
          ]),
      secretOrKey: process.env.ACCESS_TOKEN,
    },
    function (jwtPayload, done) {
        console.log(jwtPayload)
      //   const currentTimestamp = Date.now() / 1000; // Convert to seconds
      // if (jwtPayload.exp < currentTimestamp) {
      //   return done(null, false, { message: 'Token has expired' });
      // }
      return userDB.findById(jwtPayload.user.id)
        .then((user) => {
            console.log(user);
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);