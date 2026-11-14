const mongoose=require("mongoose")


const userSchema= new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username should be unique"]
    },
    email:{
        type:String,
        unique:[true,"Email should be unique"]

    },
    password:{
        type:String,
        required:true,
        select:false
    },
    age:{
        type:Number,
        required:true,
        min: [18, "Age must be at least 18"],
        max: [80, "Age must be at most 80"],
        validate:{
            validator:function(v){
                return v>=18 && v<=80;
            },
            message:"Age must be between 18 and 80"
        }
    },
    contactNo:{
        type:Number,
        required:true,
        unique:[true,"Phone Number should be unique"]

    },
    profession:{
        type:String,
        enum:["Student","Fresher","Working"],   
        default:"Student",
        required:[true,"profession is required"]
    }
})

const userModel=mongoose.model("users",userSchema);
module.exports=userModel;