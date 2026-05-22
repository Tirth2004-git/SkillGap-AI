const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Analyzes parsed resume text against a target job role using the Gemini API.
 * @param {string} resumeText - Raw text extracted from the resume.
 * @param {string} targetRole - The user's target job role.
 * @returns {Promise<object>} The structured analysis report.
 */
const analyzeResumeWithGemini = async (resumeText, targetRole) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Use gemini-1.5-flash or gemini-2.5-flash for fast and cost-effective text analysis
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

  const prompt = `
    You are an expert ATS (Applicant Tracking System) recruiter and career readiness analyzer.
    Analyze the following resume details for the target job role: "${targetRole}".

    Resume Text:
    """
    ${resumeText}
    """

    Perform a rigorous assessment and return a JSON object with the exact format detailed below.
    The response MUST be valid JSON, containing only the JSON data matching the schema. Do not include markdown code block formatting.
    
    JSON Schema:
    {
      "atsScore": <number between 0 and 100 representing how well the resume matches the target role>,
      "missingSkills": [<array of technical skills, technologies, or keywords that are missing from the resume but highly relevant for the target role>],
      "strongSkills": [<array of technical skills, tools, or qualifications present in the resume that align well with the target role>],
      "suggestions": [<array of specific, actionable suggestions to optimize the resume, rewrite sections, format content, or add sections for the target role>],
      "roadmap": [
        {
          "week": <number, 1 to 4>,
          "focus": <string, overall focus for this week>,
          "days": [
            {
              "day": <number, 1 to 30>,
              "topic": <string, specific topic to learn>,
              "tasks": [<array of concrete tasks or exercises for this day>]
            }
          ]
        }
      ],
      "recommendedCourses": [
        {
          "name": <string, specific course title related to missing skills>,
          "platform": <string, e.g. "YouTube", "freeCodeCamp", "Coursera", "Udemy">,
          "url": <string, optional URL or search terms for finding it>,
          "type": <string, either "Free" or "Paid">
        }
      ],
      "summary": <string, 2-3 sentence career readiness evaluation for this role>
    }

    Instructions:
    1. Assess the ATS score honestly based on the matches between the resume text and industry-standard requirements for the target role.
    2. Provide a 30-day, day-wise learning roadmap broken into 4 weeks. Fill in days 1 through 30.
    3. Ensure the roadmap progresses logically from beginner concepts to advanced concepts, focusing on learning the identified missing skills.
    4. Provide at least 3-4 course recommendations from Coursera, Udemy, YouTube, or freeCodeCamp.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini API execution error:', error);
    throw new Error(`Failed to analyze resume with Gemini: ${error.message}`);
  }
};

module.exports = { analyzeResumeWithGemini };
