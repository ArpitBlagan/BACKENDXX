const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv').config();
const cookieSession=require('cookie-session');
const cookie=require('cookie-parser');
const passport = require("passport");
const Router=require('./Router');
mongoose.connect(process.env.URL,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(con=>{console.log("connnected")});
require('./auth/passport');
require('./auth/passportGoogle')
require('./auth/passportGithub')
const app=express();
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);
app.use(express.session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors({
  origin:['*','http://localhost:5173','http://localhost:5001','https://accounts.google.com'],
  credentials:true
}));app.use(cookie());
app.use(express.urlencoded({extended:true}));
app.use('/api/v1',Router);
app.listen(process.env.PORT,()=>{
    console.log('Listening');
});