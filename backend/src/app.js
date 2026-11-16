const express=require("express");
const authRouter=require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app=express();
const interviewRouter=require("./routes/interview.routes")

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

/**Routes */

app.use("/api/auth",authRouter);
app.use("/api/ai",interviewRouter);

module.exports=app;