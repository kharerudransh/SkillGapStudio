const {GoogleGenAI}=require ("@google/genai");
const {z}=require("zod");
const{zodToJsonSchema}=require("zod-to-json-schema");
const puppeteer=require("puppeteer");



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

        

        const validatedResult = interviewSchema.parse(result);

        return validatedResult;

}

async function generateResumePdf({resume, selfDescription, jobDescription}){
    const resumeSchema=z.object({
        html:z.string().describe("The HTML code for the resume css should be inside html make the resume modern and professional with maximizing ats score do not add any extra spaces or new lines , also use inline styles for css , also make resume according to the users resume and selfDescription which is given below , also make it according to the job description. "),
    })
    const prompt = `Generate a modern professional resume which increase the chances of selection according to the job description and dont add any misinfromation or irrelevant details. The resume should be generated for a candidate based on their resume data and job description . 
    Help candidate enhancing his/her chances of selection but dont add something which is not present in his resume also make the best result possible , also do not add any extra line or extra space. 
    Return HTML code for the resume and try to make it in 1 page if not possible the go to 2 pages, Page is of A4 size 
    with margin  margin:{top:"1cm",right:"1cm",bottom:"1cm",left:"1cm"}



    resume :${resume}
    selfDescription: ${selfDescription}
    jobDescription: ${jobDescription}
    Return JSON with EXACTLY these keys and shapes:
    - html: string (The HTML code for the resume css should be inside html make the resume modern and professional with maximizing ats score do not add any extra spaces or new lines , also use inline styles for css , also make resume according to the users resume and selfDescription which is given below , also make it according to the job description. )
    
    
    
    some important points 

    You are an expert ATS Resume Strategist, Professional Resume Writer, Technical Recruiter, and Career Consultant with extensive experience in hiring for software engineering, IT, product, data science, and other professional roles.

    Your responsibility is to transform an existing candidate resume into a highly professional, ATS-friendly, job-specific resume using the candidate's original resume and the target Job Description (JD).

    Your primary objective is to improve the candidate's chances of getting shortlisted by improving relevance, clarity, presentation, keyword alignment, and professional impact.

    STRICT RULES:

    1. FACTUAL ACCURACY
    - Never invent skills, qualifications, certifications, internships, companies, projects, achievements, or work experience.
    - Never fabricate numerical achievements, percentages, revenue, performance improvements, or user counts.
    - Only use information supported by the original resume or explicitly provided by the candidate.
    - If information is missing, do not assume it.

    2. JOB DESCRIPTION ANALYSIS
    - Understand the target role and its responsibilities.
    - Extract mandatory skills, preferred skills, technical requirements, tools, and domain knowledge.
    - Identify relevant keywords and concepts.
    - Compare the JD against the candidate's existing qualifications.
    - Prioritize the candidate's actual matching skills.

    3. PROFESSIONAL SUMMARY
    - Rewrite the summary specifically for the target role.
    - Keep it concise, impactful, and technically relevant.
    - Highlight the candidate's strongest relevant qualifications.
    - Avoid generic statements such as hardworking, passionate, dedicated, or enthusiastic.

    4. TECHNICAL SKILLS
    - Organize skills into logical categories.
    - Prioritize skills relevant to the JD.
    - Remove irrelevant skills when they weaken the resume.
    - Never add unsupported skills.
    - Use industry-standard terminology.

    5. PROJECT OPTIMIZATION
    - Rewrite project descriptions using strong action verbs.
    - Explain the technical implementation.
    - Highlight architecture, tools, technologies, and engineering complexity.
    - Emphasize relevant features and contributions.
    - Use measurable results only when supported by the source information.
    - Prioritize projects according to their relevance to the target position.

    6. EXPERIENCE OPTIMIZATION
    - Improve internship and professional experience descriptions.
    - Highlight responsibilities, technical contributions, and achievements.
    - Use concise bullet points.
    - Avoid repetitive statements.

    7. ATS OPTIMIZATION
    - Use standard section headings.
    - Include relevant keywords naturally.
    - Avoid keyword stuffing.
    - Maintain readable formatting.
    - Prefer a single-column structure.
    - Avoid tables, text boxes, graphics, and unnecessary icons.
    - Ensure important information is available as selectable text.

    8. RESUME LENGTH
    - Prefer one page for students and freshers.
    - Use two pages when the candidate's experience genuinely requires it.
    - Do not remove important relevant information merely to achieve a one-page resume.

    9. LANGUAGE AND WRITING
    - Use professional, concise English.
    - Avoid unnecessary adjectives.
    - Use strong action verbs.
    - Maintain consistent tense and formatting.
    - Remove grammatical errors and repetition.

    10. PRESERVE CANDIDATE IDENTITY
    - Preserve the candidate's real educational background.
    - Preserve actual project names and technologies.
    - Preserve genuine achievements and experience.
    - Do not change the candidate's identity or employment history.

    OUTPUT REQUIREMENTS:

    Generate the following:

    A. JOB DESCRIPTION ANALYSIS
    - Target job role.
    - Mandatory skills.
    - Preferred skills.
    - Relevant keywords.
    - Candidate's matching qualifications.
    - Identified skill gaps.

    B. RESUME IMPROVEMENT REPORT
    - Weak sections.
    - Content that needs rewriting.
    - Irrelevant or repetitive information.
    - Missing information that should be supplied by the candidate.

    C. ENHANCED RESUME
    Generate the complete rewritten resume, not just suggestions.

    Use this section order when appropriate:
    1. Candidate Name and Contact Information
    2. Professional Summary
    3. Technical Skills
    4. Work Experience / Internships
    5. Projects
    6. Education
    7. Certifications and Achievements

    Reorder sections according to the candidate's strongest evidence and target role.

    D. OPTIMIZATION REPORT
    - Keywords successfully incorporated.
    - Relevant skills highlighted.
    - Improvements made.
    - Unsupported or missing JD requirements.
    - Suggestions for further improvement.

    E. FORMATTING INSTRUCTIONS
    Generate a clean, professional, ATS-compatible resume suitable for PDF export.

    The final resume must be recruiter-friendly, readable, concise, and factually accurate.

    IMPORTANT:
    Do not guarantee ATS scores, interview calls, shortlisting, or job selection.
    Your objective is to maximize the quality and relevance of the candidate's application using only verified information.




    Recommended resume styling configuration
    Give your resume generator these default styling specifications.
    Element	Configuration
    Page	A4
    Layout	Single column
    Font	Arial / Calibri
    Name	22 pt bold
    Section headings	12 pt bold
    Body	10–11 pt
    Margins	0.6 inches
    Text color	Black / Dark Navy
    Section spacing	Consistent
    Resume length	1–2 pages
    `

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(resumeSchema),
        },
    });
    const result = JSON.parse(response.text);

    const validatedResult = resumeSchema.parse(result);

    const pdfBuffer = await generatePdfFromHtml({ htmlContent: validatedResult.html });
    
    return pdfBuffer;
    
}

async function generatePdfFromHtml({htmlContent}){
    const browser=await puppeteer.launch();
    const page=await browser.newPage();
    await page.setContent(htmlContent,{waitUntil:"networkidle0"});
    const pdf=await page.pdf({
        format:"A4",
        printBackground:true,
        margin:{top:"1cm",right:"1cm",bottom:"1cm",left:"1cm"},
    });
    await browser.close();
    return pdf;
}



module.exports = {generateInterviewReport,generateResumePdf};





