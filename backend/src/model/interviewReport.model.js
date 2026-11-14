const mongoose=require("mongoose");


const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Question is required"],
        trim:true,
    },
    intention:{
        type:String,
        required:[true,"Intention is required"],
        trim:true,
    },
    answer:{
        type:String,
        required:[true,"Answer is required"],
        trim:true
    }
    
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Question is required"],
        trim:true,
    },
    intention:{
        type:String,
        required:[true,"Intention is required"],
        trim:true,
    },
    answer:{
        type:String,
        required:[true,"Answer is required"],
        trim:true
    }
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"],
        trim:true,
    },
    severity:{
        type:String,
        required:[true,"Severity is required"],
        enum:["High","Medium","Low"],
    },
    reason:{
        type:String,
        required:[true,"Reason is required"],
        trim:true,
    },
})

const preperationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"],
    },
    topics:{
        type:[String],
        required:[true,"Topics are required"],
    }
    
})


const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job description is required"]
    },
    selfDescription:{
        type:String,
        required:[true,"Questions are required"]
    },
    resume:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:[0,"Match Score can't be less than 0"],
        max:[100,"Match Score can't be greater than 100"]
    },
    technicalQuestions:[technicalQuestionSchema],
    behaviouralQuestions:[behaviouralQuestionSchema],
    skillGap:[skillGapSchema],
    preperationPlan:[preperationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"User is required"]   
    },
    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true,
    }

});

const interviewReportModel=mongoose.model("InterviewReport",interviewReportSchema)
module.exports=interviewReportModel; 