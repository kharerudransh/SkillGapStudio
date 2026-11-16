const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const {generateInterviewReport , generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../model/interviewReport.model");

//To generate interview report
async function generateInterviewReportController(req, res) {
    try {

        // 1. Validate uploaded file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required"
            });
        }

        // 2. Get request body
        const { selfDescription, jobDescription } = req.body;

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Self description and job description are required"
            });
        }

        // 3. Extract text from PDF
        const parser = new pdfParse.PDFParse({
            data: new Uint8Array(req.file.buffer)
        });

        const resumeContent = await parser.getText();

        if (!resumeContent.text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from resume"
            });
        }

        // 4. Generate report using AI
        const interviewReportByAi = await generateInterviewReport({
            resume:resumeContent.text,
            selfDescription,
            jobDescription
        });

        // 5. Save report in database
        const interviewReport = await interviewReportModel.create({
            ...interviewReportByAi,
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        // 6. Send response
        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {

        console.error("Interview report generation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate interview report",
            error: error.message
        });
    }
    finally {
        await parser.destroy();
    }
}

//To fetch a specific interview report of the user 
async function getInterviewReportByIdController(req , res){
    try{
        const {interviewId} = req.params;
        const interviewReport=await interviewReportModel.findOne({_id:interviewId, user:req.user.id});

        if(!interviewReport){
            return res.status(404).json({
                success:false,
                message:"Interview report not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Interview report fetched successfully",
            interviewReport
        });

    }
    catch(err){
        console.error("Interview report by id error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get interview report by id",
            error: error.message
        });
    }
}

//To fetch all the interview report of the user
async function getAllInterviewReportController(req,res){
    const interviewReports=await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -improvementArea -behavioralFeedback -skillGap  -preperationPlan" );

    if(!interviewReports){
        return res.status(404).json({
            success:false,
            message:"Interview reports not found"
        })
    }
    return res.status(200).json({
        success:true,
        message:"Interview reports fetched successfully",
        interviewReports
    });
}
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        if (!mongoose.isValidObjectId(interviewReportId)) {
            return res.status(400).json({ success: false, message: "Invalid interview report id" });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id,
        });

        if (!interviewReport) {
            return res.status(404).json({ success: false, message: "Interview report not found" });
        }

        const pdfBuffer = Buffer.from(
            await generateResumePdf({
                resume: interviewReport.resume,
                selfDescription: interviewReport.selfDescription,
                jobDescription: interviewReport.jobDescription,
            })
        );

        res.set({
            "Content-Type": "application/pdf",
            "Content-Length": pdfBuffer.length,
            "Content-Disposition": `attachment; filename="resume-${Date.now()}.pdf"`,
        });
        return res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error("Resume PDF generation error:", error);
        return res.status(500).json({ success: false, message: "Failed to generate resume PDF" });
    }
}


module.exports = { generateInterviewReportController ,getAllInterviewReportController, getInterviewReportByIdController , generateResumePdfController};
