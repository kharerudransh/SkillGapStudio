const {GoogleGenAI}=require ("@google/genai");
const {z}=require("zod");
const{zodToJsonSchema}=require("zod-to-json-schema");



const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY,
})


const interviewSchema=z.object({
    matchScore:z.number().describe("The match score between the candidate and the job description highest is 100 lowest is 0"),

    technicalQuestions:z.array(
        z.object({
            question:z.string().describe("The Technical question that can be asked in interview"),
            intention:z.string().describe("Why is this question being asked"),
            answer:z.string().describe("Suggested best answer for the candidate"),
        })
    ).describe("Technical Questions in the interview"),
    behaviouralQuestions:z.array(
        z.object({
            question:z.string().describe("The Behavioral question that can be asked in interview"),
            intention:z.string().describe("Why is this question being asked"),
            answer:z.string().describe("Suggested best answer for the candidate"),
        })
    ).describe("Behavorial Questions in the interview"),


    skillGap:z.array(
        z.object({
            skill:z.string().describe("The Skill that is missing in the candidate"),
            severity:z.enum(["High","Medium","Low"]).describe("The Severity of the skill gap"),
            reason:z.string().describe("The Reason for the skill gap"), 
        })
    ).describe("Misssing skill gap in the candidate for the job role"),

    preperationPlan:z.array(z.object({
    day: z.number().describe("The Day of the preparation plan"),
    topics: z.array(z.string().describe("The Topic to be prepared")),
})).describe("Preparation Plan for the candidate"),

    title:z.string().describe("The Title of the job title"),
    



}).describe("You are a helpful agent that will provide a comprehensive analysis of the candidate's interview performance and give the questions and answers and preparation plan for the candidate for the interview")


async function generateInterviewReport({resume, selfDescription, jobDescription}){
    const prompt = `You are an expert technical interviewer. Evaluate the candidate for the job.

                    Candidate's Resume:
                    ${resume}

                    Candidate's Self Description:
                    ${selfDescription}

                    Job Description:
                    ${jobDescription}

                    Return JSON with EXACTLY these keys and shapes:
                    - matchScore: number from 0 to 100
                    - technicalQuestions: array of 5 objects { question, intention, answer }
                    - behaviouralQuestions: array of 4 objects { question, intention, answer }
                    - skillGap: array of objects { skill, severity ("High" | "Medium" | "Low"), reason }
                    - preparationPlan: array of 7 objects { day (number 1 to 7), topics (array of strings) }
                    - title: string (Job Title of the job description)

                    Every item in these arrays must be an object with all listed fields. Never return plain strings.`;

    const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: z.toJSONSchema(interviewSchema),
            },
        });
    const result = JSON.parse(response.text);

        console.log(
            "Gemini Response:",
            JSON.stringify(result, null, 2)
        );

        const validatedResult = interviewSchema.parse(result);

        return validatedResult;

}

module.exports = generateInterviewReport;





