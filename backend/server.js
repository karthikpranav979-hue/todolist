
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://karthikpranav979-hue.github.io"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS: Origin not allowed"));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing!");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.status(200).send("To-Do AI backend is running!");
});

app.post("/api/breakdown", async (req, res) => {
    try {
        const { goal } = req.body;

        console.log("Request received:", goal);

        if (typeof goal !== "string" || !goal.trim()) {
            return res.status(400).json({
                error: "Please enter a valid goal."
            });
        }

        const prompt = `
Break the following goal into 5 to 10 practical, actionable tasks.

Goal: ${goal.trim()}

Return only valid JSON in this format:
{
    "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
    ]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        console.log("Gemini response received");

        const result = JSON.parse(response.text);

        if (!Array.isArray(result.tasks) || result.tasks.length === 0) {
            throw new Error("Invalid task response from Gemini.");
        }

        res.status(200).json({
            tasks: result.tasks
        });

    } catch (error) {
        console.error("AI API Error:", error);

        res.status(500).json({
            error: "Unable to generate tasks. Please try again later."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
