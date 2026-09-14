const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


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
You are ShikshaAI, an educational AI tutor.

Explain the topic "${topic}" to a student in very simple language.

The student selected this language: ${language}

IMPORTANT LANGUAGE RULE:

If the selected language is Hindi:
- Write the complete explanation in Hindi.
- Use Devanagari script.
- Do NOT write the explanation in English.
- Use simple Hindi that a student can easily understand.
- Technical terms can be written in English inside brackets when useful.

If the selected language is English:
- Write the complete explanation in simple English.

Give the explanation in this structure:

1. Simple Definition
2. Main Points
3. Easy Example
4. Short Summary

Keep the explanation clear, short and student-friendly.
`;


        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt

        });


        res.json({

            explanation: response.text

        });


    } catch (error) {

        console.error(
            "Explanation Error:",
            error
        );

        res.status(500).json({

            error: "AI explanation failed"

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
Create a quiz about "${topic}".

The selected language is ${language}.

If the selected language is Hindi:
- Write the questions in simple Hindi.
- Use Devanagari script.
- Write all four options in Hindi.
- Keep the correct answer in exactly the same text as one of the options.

If the selected language is English:
- Write the questions and options in simple English.

Generate exactly 5 multiple-choice questions.

Each question must contain:
- question
- exactly 4 options
- correct answer

Return ONLY valid JSON.

Do not use markdown.
Do not use code blocks.
Do not add explanations.

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
`;


        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt

        });


        let text = response.text.trim();


        // Remove markdown code blocks
        text = text.replace(/```json/gi, "");
        text = text.replace(/```/g, "");

        text = text.trim();


        // Find JSON array if AI adds extra text
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");

        if (start !== -1 && end !== -1) {

            text = text.substring(
                start,
                end + 1
            );

        }


        const quiz = JSON.parse(text);


        res.json({

            quiz: quiz

        });


    } catch (error) {

        console.error(
            "Quiz Error:",
            error
        );

        res.status(500).json({

            error: "Quiz generation failed"

        });

    }

});



// ==========================================
// START SERVER
// ==========================================

app.listen(3000, () => {

    console.log(
        "🚀 ShikshaAI running at http://localhost:3000"
    );

});