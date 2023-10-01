const express=require('express');
const { register,login,info,check } =require('./controller/user');
const passport = require('passport');
const Router=express.Router();
const successLoginUrl = "https://65198cff99e6aa618a413198--peaceful-taffy-b3c774.netlify.app/main";
const errorLoginUrl = "https://65198cff99e6aa618a413198--peaceful-taffy-b3c774.netlify.app";
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
  failureRedirect: errorLoginUrl,}),
function(req, res) {
  // Successful authentication, redirect home.
   console.log("user",req.user);
        res.cookie("name",req.user.name ,{
            //30 days in milisecond
            httpOnly:true,
            sameSite: 'none',
            secure:true
        });
        res.redirect("https://65198cff99e6aa618a413198--peaceful-taffy-b3c774.netlify.app/first");
});
Router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureMessage: "Cannot login to Google, please try again later!",failureRedirect: errorLoginUrl,
    }),
    (req, res) => {
        console.log("user",req.user);
        res.cookie("name",req.user.name ,{
            //30 days in milisecond
            httpOnly:true,
            sameSite: 'none',
            secure:true
        });
        res.redirect("https://65198cff99e6aa618a413198--peaceful-taffy-b3c774.netlify.app/first");
    }
);
// Router.get('/info',passport.authenticate('jwt', { session: false }),info);
Router.route('/check').get(check);
module.exports=Router;
