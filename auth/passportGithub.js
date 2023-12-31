const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const userDB=require('../models/User')
passport.use(new GitHubStrategy(
    {
        clientID:process.env.GIT_ID,
        clientSecret:process.env.GIT_SEC,
        callbackURL:'https://xeroo.onrender.com/api/v1/auth/github/callback'
    },async(req,accessToken, refreshToken, profile, done)=>{
        console.log(profile);
        const defaultUser={
            github_id:profile.id,
            name:profile.username,
        }
        const user=await userDB.find({github_id:defaultUser.github_id});
        console.log(user);
        if(!user||user.length==0){
            const new_user=await userDB.create(defaultUser).catch((err)=>{
              console.log("Error signing up", err);
              done(err, null);
            });
            if(new_user){
              return done(null, new_user);
            }
        }
        if (user&&user[0]){
            return done(null,user[0]);}
    }   
))
passport.serializeUser(function(user,cb){
    console.log("serialize",user);
    cb(null,user.id);
})
passport.deserializeUser(async (id, cb) => {
    console.log("id",id)
    const user = await userDB.find({github_id:id}).catch((err) => {
      console.log("Error deserializing", err);
      cb(err, null);
    });
    console.log("DeSerialized user", user);
    if (user) cb(null, user);
  });
