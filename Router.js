const express=require('express');
const { register,login,info,check } =require('./controller/user');
const passport = require('passport');
const Router=express.Router();
const successLoginUrl = "http://localhost:5173";
const errorLoginUrl = "http://localhost:5173/login";
Router.route('/register').post(register);
Router.route('/login').post(login);
Router.get(
    "/login/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
); 
Router.get("/login/github",passport.authenticate("github",{scope: [ 'user:profile','iluser:email' ] }));
Router.get('/auth/github/callback',
passport.authenticate('github', { 
  failureMessage:'Cannot login to Github, please try again later!',
  failureRedirect: 'http://localhost:5173/login',
  successRedirect:'http://localhost:5173' }),
function(req, res) {
  // Successful authentication, redirect home.
  console.log("User: ", req.user);
      res.json({user:req.user});
});
Router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureMessage: "Cannot login to Google, please try again later!",
      failureRedirect: errorLoginUrl,
      successRedirect: successLoginUrl,
    }),
    (req, res) => {
      console.log("User: ", req.user);
      res.json({user:req.user});
    }
);
// Router.get('/info',passport.authenticate('jwt', { session: false }),info);
Router.route('/check').get(check);
module.exports=Router;