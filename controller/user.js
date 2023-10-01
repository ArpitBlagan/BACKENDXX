const userDB=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
exports.register=async(req,res)=>{
    const {email,name,password}=req.body;
    const user=await userDB.findOne({email});
    if(user){
        return res.status(409).json({ message: "User with email already exists!" });
    }
    const pass=await bcrypt.hash(password,10);
    const new_user=userDB.create({email,name,password:pass});
    if(new_user){
        return res.json({ message: "Thanks for registering" })
    }
    else{
        return res.status(409).json({ message: "User with email already exists!" });
    }
}
exports.login=async(req,res)=>{
    const {email,password}=req.body;
    const user=await userDB.findOne({email});
    if(user&&(await bcrypt.compare(password,user.password))){
        const token= jwt.sign({
            user:{
                id:user._id,
                email:user.email,
                name:user.name
            }
        },process.env.ACCESS_TOKEN,{expiresIn:"30m"});
        res.cookie("jwt",token,{
            //30 days in milisecond
            httpOnly:true,
            sameSite: 'none',
            secure:true
        });
       return  res.json({ message: "Welcome Back!" });  
    }
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });
}
exports.info=async(req,res)=>{
    console.log(req.user);
    res.json({message:"working"});
}
exports.check=async(req,res)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
            if(decoded){
                req.user=decoded.user;
            }
            else{
                return res.json({message:"not authorized"});
            }   
            
        });console.log(req.user);
                const user=await userDB.findById(req.user.id);
                console.log(user);
                if(user){
                    return res.json({message:"authorized",data,user});
                }else{
                    return res.json({message:"not authorized"});
                }
    }
    return res.send("good");    
}
