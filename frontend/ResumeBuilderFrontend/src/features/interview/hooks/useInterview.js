import { getAllInterviewReportController,getInterviewReportById , generateInterviewReport } from "../services/interview";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";


export const useInterview=()=>{
    const context = useContext(InterviewContext)
    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }
    const {report , setReport , reports,loading,setReports,setLoading }=context;


    const handleGenerateReport =async ({resumeFile , jobDescription , selfDescription})=>{
        try{
            setLoading(true);
            const data = await generateInterviewReport({resumeFile , jobDescription , selfDescription})
            setReport(data.interviewReport);
            
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }

    const handleGetAllReports = async () =>{
        try {
            setLoading(true);
            const data = await getAllInterviewReportController();
            setReports(data);
            
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }

    const handleGetReportById = async (id) =>{
        try{
            setLoading(true);
            const data = await getInterviewReportById(id);
            setReport(data.interviewReport);

        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }

    return {
        report,
        setReport,
        reports,
        setReports,
        loading,
        setLoading,
        handleGenerateReport,
        handleGetAllReports,
        handleGetReportById
    }
}