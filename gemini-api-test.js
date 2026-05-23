import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { tavily } from '@tavily/core';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves your frontend index.html natively

const PORT = process.env.PORT || 5000;

// Initialize APIs securely using process.env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

let db;

async function initDatabase() {
    db = await open({
        filename: './iceberg_cache.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS curriculum_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_key TEXT UNIQUE,
            curriculum_json TEXT,
            search_count INTEGER DEFAULT 1,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log("🧊 IceBerg Core Database Initialized Successfully.");
}

// ---- BYPASS TAVILY: GEMINI ISOLATION TEST ROUTE ----
app.get('/api/test-gemini', async (req, res) => {
    try {
        console.log("🧪 Running direct Gemini isolation test...");

        const mockWebContext = `
        Title: What is Docker
        Content: Docker is a containerization platform used to package applications into containers.
        
        Title: Getting Started with Containers
        Content: Containers isolate software from its environment and ensure it works uniformly despite differences between development and staging.
        `;

        const prompt = `You are an educational architect. Synthesize this text into a clean JSON structure. 
        Return ONLY valid JSON matching this scheme:
        {
          "topic": "mock-test",
          "summary": "This is a mock summary test.",
          "milestones": [{"phase": 1, "title": "Test Milestone", "core_concept": "Testing", "action_item": "Verify API Works"}]
        }
        
        Context:
        ${mockWebContext}`;

        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let rawText = aiResponse.text.trim();
        rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

        const parsedJson = JSON.parse(rawText);
        res.json({ success: true, message: "Gemini is connected and working perfectly!", data: parsedJson });

    } catch (error) {
        console.error("❌ Isolated Gemini Test Failure:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            tip: "If you see API_KEY_INVALID, your GEMINI_API_KEY inside your .env file is wrong or missing." 
        });
    }
});

// ---- THE LIVE MAIN CURRICULUM ROUTE ----
app.get('/api/curriculum', async (req, res) => {
    try {
        const topic = req.query.topic;
        if (!topic) {
            return res.status(400).json({ error: "Missing topic query parameter." });
        }

        const topicKey = topic.trim().toLowerCase();

        // Check local cache database
        const cachedRow = await db.get(
            'SELECT curriculum_json FROM curriculum_cache WHERE topic_key = ?', 
            [topicKey]
        );

        if (cachedRow) {
            console.log(`⚡ [Cache Hit] Serving stored data for: ${topicKey}`);
            return res.json(JSON.parse(cachedRow.curriculum_json));
        }

        console.log(`🌐 [Cache Miss] Scouring the live web for: ${topicKey}...`);

        // Fetch from the live web via Tavily
        const searchResponse = await tvly.search(topicKey, {
            searchDepth: "basic",
            maxResults: 5
        });

        const webContext = searchResponse.results
            .map(res => `Title: ${res.title}\nContent: ${res.content}`)
            .join("\n\n");

        console.log("🤖 Consulting Gemini 2.5 Flash to de-haze the noise...");

        const prompt = `You are an elite educational architect. Analyze this raw, messy web data and completely strip away all marketing fluff, visual/text noise, ads, and repetitive filler. Reconstruct the clean, underlying core consensus into a pristine JSON structure.

        Raw Web Data Context:
        ${webContext}

        Output requirements:
        Return ONLY valid JSON matching this exact scheme. No conversational text, no markdown wrappers, no code blocks. Just the raw JSON object.
        {
          "topic": "${topicKey}",
          "summary": "A concise summary of what this topic is.",
          "milestones": [
            {
              "phase": 1,
              "title": "Milestone Title",
              "core_concept": "The main concept to learn.",
              "action_item": "An actionable project requirement to prove mastery."
            }
          ]
        }`;

        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let rawText = aiResponse.text.trim();
        rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

        const parsedJson = JSON.parse(rawText);

        // Save to local database cache
        await db.run(
            'INSERT OR IGNORE INTO curriculum_cache (topic_key, curriculum_json) VALUES (?, ?)',
            [topicKey, rawText]
        );

        res.json(parsedJson);

    } catch (error) {
        console.error("Engine Generation Error:", error);
        res.status(500).json({ error: "The engine failed to process this request." });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: "IceBerg Server is alive and operational." });
});

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 IceBerg Engine roaring on http://localhost:${PORT}`);
    });
});
