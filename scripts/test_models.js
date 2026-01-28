
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; // Hack to get client? No, listModels is on the client.
        // Actually the SDK doesn't expose listModels directly on the main class in some versions, 
        // but let's try the standard way if available, or just test a known working one.

        // Simpler: Let's just try to generate with a few common names and see which one works.
        console.log("Testing common model names...");
        console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "YES (Length: " + process.env.GEMINI_API_KEY.length + ")" : "NO");

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-pro"
        ];

        for (const modelName of candidates) {
            try {
                console.log(`Trying ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ SUCCESS: ${modelName} works!`);
                break;
            } catch (e) {
                console.log(`❌ FAILED: ${modelName}`);
                console.dir(e, { depth: null });
            }
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

listModels();
