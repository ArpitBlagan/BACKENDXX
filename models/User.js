const mongoose=require('mongoose');
const User=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    },
    email:{
        type:String,
    },
    password:{
        type:String
    },
    google_id:{
        type:String
    },
    github_id:{
        type:String
    }
});
module.exports=mongoose.model('userDB',User);