import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export async function generateInterviewReport({resumeFile , jobDescription , selfDescription}) {
    const formData = new FormData();
    formData.append("resume", resumeFile);        
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    try {
        const response = await api.post("/api/ai/analyse", formData, {
            timeout: 120000,    // AI call can take a while
        });
        return response.data;   // { success, message, interviewReport }
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to generate interview report"
        );
    }
}

export async function getInterviewReportById(interviewId){
    const response= await api.get(`/api/ai/report/${interviewId}`);
    return response.data;
}


export async function getAllInterviewReportController(){
    try {
        const response=await api.get("/api/ai/");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch all interview reports"
        );
    }
}

export async function generateResumePdf(interviewReportId){
    try {
        const response = await api.post(
            `/api/ai/pdf/${interviewReportId}`,
            null,
            { responseType: "blob", timeout: 120000 }
        );
        return response.data;
    }
    catch(error){
        throw new Error(
            error.response?.data?.message || "Failed to generate resume pdf"
        )
    }
}