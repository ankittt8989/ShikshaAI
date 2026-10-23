const express = require("express");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(__dirname));


// ==========================================
// GEMINI AI
// ==========================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ==========================================
// MODEL FALLBACK SYSTEM
// ==========================================

const MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash"
];


async function generateAI(prompt) {

    let lastError = null;

    for (const model of MODELS) {

        try {

            console.log(`🤖 Trying model: ${model}`);

            const response = await ai.models.generateContent({
                model: model,
                contents: prompt
            });

            console.log(`✅ Success with: ${model}`);

            return response;

        } catch (error) {

            lastError = error;

            console.log(`❌ ${model} failed`);

            console.log(error.message);

            // Try next model
        }
    }

    throw lastError;
}


// ==========================================
// AI EXPLANATION
// ==========================================

app.post("/explain", async (req, res) => {

    try {

        const topic = req.body.topic;
        const language = req.body.language || "English";

        if (!topic) {

            return res.status(400).json({
                error: "Topic is required"
            });

        }


        const prompt = `
You are ShikshaAI, a friendly AI teacher.

Explain the topic "${topic}" to a student.

Language: ${language}

IMPORTANT:
Give the entire explanation in ${language}.

Use very simple language.

Structure the answer exactly like this:

1. Simple Definition

Explain what the topic means in easy words.

2. Main Points

Give 4 to 5 important points.

3. Easy Example

Give one simple real-life example.

4. Short Summary

Give a short summary in 2 or 3 sentences.

Make the explanation:
- Easy to understand
- Student friendly
- Clear
- Educational
- Not unnecessarily complicated
`;


        const response = await generateAI(prompt);


        res.json({
            explanation: response.text
        });


    } catch (error) {

        console.error("Explanation Error:", error);

        res.status(503).json({
            error: "AI service is temporarily unavailable. Please try again."
        });

    }

});


// ==========================================
// AI QUIZ
// ==========================================

app.post("/quiz", async (req, res) => {

    try {

        const topic = req.body.topic;
        const language = req.body.language || "English";

        if (!topic) {

            return res.status(400).json({
                error: "Topic is required"
            });

        }


        const prompt = `
You are ShikshaAI, an AI teacher.

Create a quiz about:

"${topic}"

Language: ${language}

Generate EXACTLY 5 multiple-choice questions.

Each question must contain:

- question
- options
- answer

There must be exactly 4 options for every question.

Return ONLY valid JSON.

DO NOT use markdown.

DO NOT use:
\`\`\`json

DO NOT add any explanation outside the JSON.

Use exactly this format:

[
    {
        "question": "Question here",
        "options": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
        ],
        "answer": "Option A"
    }
]

Make the questions suitable for students.

Make them clear and easy to understand.

The correct answer must be exactly one of the four options.
`;


        const response = await generateAI(prompt);


        let text = response.text.trim();


        // Remove markdown if AI accidentally adds it
        text = text.replace(/```json/gi, "");
        text = text.replace(/```/g, "");

        text = text.trim();


        const quiz = JSON.parse(text);


        // Make sure exactly 5 questions exist
        if (!Array.isArray(quiz) || quiz.length !== 5) {

            throw new Error(
                "AI did not return exactly 5 questions"
            );

        }


        res.json({
            quiz: quiz
        });


    } catch (error) {

        console.error("Quiz Error:", error);

        res.status(503).json({
            error: "Quiz generation failed. Please try again."
        });

    }

});


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/index.html");

});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("🚀 ShikshaAI Server Started");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("======================================");
    console.log("");

});