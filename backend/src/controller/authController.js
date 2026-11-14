const userModel = require("../model/user.model");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const tokenBlacklistModel=require("../model/blacklist.model");




/**
 * @desc User Register
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password, contactNo, age, profession } = req.body;
    if (!username || !email || !password || !contactNo || !age || !profession) {
        return res.status(400).json(
            { 
                message: "All fields are required",
                success:false
             }
        );
    }
    const userAlreadyExist = await userModel.findOne({
        $or:[{email},{contactNo},{username}]
    });
    if(userAlreadyExist){
        return res.status(400).json({
            message:"User Already exists",
            success:false
        })
    }
    const hashPassword=await bcrypt.hash(password,10);
    const user=await userModel.create({
        username,
        email,
        password:hashPassword,
        contactNo,
        age,
        profession
    })
    if(!user){
        return res.status(500).json({
            message:"Failed to create user",
            success:false
        })
    }
    const token=jwt.sign({
        id:user._id,
        email,
        username
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
    })
    return res.status(201).json({
        message:"User created successfully",
        success:true,
        user:{
            username,
            email,
            contactNo,
            age,
            profession
        }
    })
    

}  

/**
 * @desc User Login
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false
        })
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({
            message: "User not found",
            success: false
        })
    }
    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
        return res.status(401).json({
            message: "Invalid password",
            success: false
        })
    }
    const token = jwt.sign({
        id: user._id,
        email,
        
    }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
    })
    return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }
    })
}

/**
 * @desc User Logout
 * @route POST /api/auth/logout
 * @access Private
 * @method POST
 */
async function logoutUserController(req, res) {
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"Unauthorized",
                success:false
            })
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findOne({email:decode.email});
        if(!user){
            return res.status(401).json({
                message:"User not logged in",
                success:false
            })
        }
        const blackListedUser=await tokenBlacklistModel.findOne({token});
        if(blackListedUser){
            return res.status(400).json({
                message:"User already logged out",
                success:false
            })
        }
        await tokenBlacklistModel.create({
            token:token
        })
        res.clearCookie("token");
        return res.status(200).json({
            message:"User logged out successfully",
            success:true
        })
        
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

/**
 * @description : get user information
 * @route : GET /api/auth/getMe
 * @access : Private
 * @method : GET
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        return res.status(200).json({
            message: "User information fetched successfully",
            success: true,
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}


module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}