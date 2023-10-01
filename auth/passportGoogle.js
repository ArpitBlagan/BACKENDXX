const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const userDB = require("../models/User");

const GOOGLE_CALLBACK_URL = "https://xeroo.onrender.com/api/v1/auth/google/callback";

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SEC,
        callbackURL: GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        const defaultUser = {
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails[0].value,
          google_id: profile.id,
        };
        const user=await userDB.find({email:defaultUser.email});
        console.log(user);
        if(!user||user.length==0){
            const new_user=await userDB.create(defaultUser).catch((err)=>{
              console.log("Error signing up", err);
              cb(err, null);
            });
            if(new_user){
                res.cookie("name",new_user.name,{
                //30 days in milisecond
                httpOnly:true,
                sameSite: 'none',
                secure:true
            });
              return cb(null, new_user);
            }
        }
        if (user&&user[0]){
            res.cookie("name",user[0].name,{
                //30 days in milisecond
                httpOnly:true,
                sameSite: 'none',
                secure:true
            });
            return cb(null, user[0]);}
      }
    )
  );
  passport.serializeUser((user, cb) => {
    console.log("Serializing user:",user);
    cb(null, user.id);
  });
  
  passport.deserializeUser(async (id, cb) => {
    console.log(id)
    const user = await userDB.findById(id).catch((err) => {
      console.log("Error deserializing", err);
      cb(err, null);
    });
    console.log("DeSerialized user", user);
    if (user) cb(null, user);
  });  
