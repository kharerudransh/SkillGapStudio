const userModel=require("../model/user.model");
const tokenBlacklistModel=require("../model/blacklist.model");
const jwt=require("jsonwebtoken");


async function authUser(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"User not logged in",
            success:false
        })
    }
    const isTokenBlacklisted=await tokenBlacklistModel.findOne({token:token});
    if(isTokenBlacklisted){
        return res.status(400).json({
            message:"Token is blacklisted",
            success:false
        })
    }
    let decode;
    try{
        decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
        next();
    }
    catch(error){
        return res.status(400).json({
            message:"Invalid Token",
            success:false
        })
    }
    
}

module.exports={authUser};