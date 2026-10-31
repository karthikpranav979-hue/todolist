
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://karthikpranav979-hue.github.io"
    ]
}));

app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.send("To-Do AI backend is running!");
});

app.post("/api/breakdown", async (req, res) => {
    try {
        const goal = req.body.goal;
        console.log("Request received:", goal);

        if (!goal || typeof goal !== "string") {
            return res.status(400).json({
                error: "Please enter a valid goal."
            });
        }

        const prompt = `
            Break this goal into 5 to 10 actionable tasks.

            Goal: ${goal}

            Return only JSON:
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

        res.json({
            tasks: result.tasks
        });

    } catch (error) {
        console.error("Gemini API Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
