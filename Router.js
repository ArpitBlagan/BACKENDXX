const express=require('express');
const { register,login,info,check } =require('./controller/user');
const passport = require('passport');
const Router=express.Router();
const successLoginUrl = "https://651940918339e837a02e3661--courageous-boba-83d994.netlify.app/main";
const errorLoginUrl = "https://651940918339e837a02e3661--courageous-boba-83d994.netlify.app";
Router.route('/register').post(register);
Router.route('/login').post(login);
Router.get(
    "/login/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
); 
Router.get("/login/github",
    passport.authenticate("github",{scope: [ 'user:profile','user:email' ] }));
Router.get('/auth/github/callback',
passport.authenticate('github', { 
  failureMessage:'Cannot login to Github, please try again later!',
  failureRedirect: errorLoginUrl,
  successRedirect: successLoginUrl,}),
function(req, res) {
  // Successful authentication, redirect home.
      res.json({user:req.user});
});
Router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureMessage: "Cannot login to Google, please try again later!",
    }),
    (req, res) => {
        console.log(req.user);
      res.json({user:req.user,message:"logged in"});
    }
);
// Router.get('/info',passport.authenticate('jwt', { session: false }),info);
Router.route('/check').get(check);
module.exports=Router;
