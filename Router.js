const express=require('express');
const { register,login,info,check } =require('./controller/user');
const passport = require('passport');
const Router=express.Router();
const successLoginUrl = "https://65194e37b441053f3e1b3418--warm-starburst-506116.netlify.app/main";
const errorLoginUrl = "https://65194e37b441053f3e1b3418--warm-starburst-506116.netlify.app";
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
      res.json({user:req.user});
});
Router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureMessage: "Cannot login to Google, please try again later!",failureRedirect: errorLoginUrl,
    }),
    (req, res) => {
        console.log(req.user);
        res.cookie("name",req.user.name ,{
            //30 days in milisecond
            httpOnly:true,
            sameSite: 'none',
            secure:true
        });
        res.redirect("https://651940918339e837a02e3661--courageous-boba-83d994.netlify.app/main");
    }
);
// Router.get('/info',passport.authenticate('jwt', { session: false }),info);
Router.route('/check').get(check);
module.exports=Router;
