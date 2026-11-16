const express=require("express");
const authMiddleware=require("../middleware/authMiddleware")
const interviewController=require("../controller/interview.controller");
const upload=require("../middleware/file.middleware");


const interviewRouter= express.Router();



/**
 * @Route {POST}
 * @Path {"/api/ai/analyse"}
 * @description Generate analysis for the user based on uploaded resume
 * @access Private
 * @middleware authMiddleware.authUser
 */
interviewRouter.post("/analyse",authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * @Route {get}
 * @description get interview report with interviewid
 * @Path {"/api/ai/report/:interviewId"}
 * @Access Private
 * @Middleware authMiddleware.authUser
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @Route {get}
 * @description get all interview reports of the user
 * @Path {"/api/ai/"}
 * @Access Private
 * @Middleware authMiddleware.authUser
 */
interviewRouter.get("/",authMiddleware.authUser, interviewController.getAllInterviewReportController)


/**
 * @Routes post
 * @description generate resume pdf based on resume , job description and self description
 * @Path {"/api/ai/pdf/:interviewReportId"}
 * @Access Private
 * @Middleware authMiddleware.authUser
 */
interviewRouter.post("/pdf/:interviewReportId",authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports=interviewRouter;