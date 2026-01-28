
const fs = require('fs');
const path = require('path');

// Read key manually to avoid dotenv parsing issues
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = keyMatch ? keyMatch[1].trim() : null;

if (!apiKey) {
    console.error("❌ Could not find GEMINI_API_KEY in .env.local");
    process.exit(1);
}

console.log(`🔑 Key found: ${apiKey.substring(0, 5)}... (Length: ${apiKey.length})`);

async function testRawApi() {
    console.log("\n--- Testing Raw REST API (List Models) ---");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ API Error Body:", JSON.stringify(data, null, 2));
        } else {
            console.log("✅ Success! Available models (first 3):");
            if (data.models) {
                console.log("All Available Models:");
                console.log(data.models.map(m => m.name));

                // Check if our models are in there
                const hasFlash = data.models.some(m => m.name.includes('gemini-1.5-flash'));
                const hasPro = data.models.some(m => m.name.includes('gemini-pro'));
                console.log(`\nContains gemini-1.5-flash? ${hasFlash}`);
                console.log(`Contains gemini-pro? ${hasPro}`);
            } else {
                console.log("No models returned?", data);
            }
        }
    } catch (e) {
        console.error("❌ Network/Fetch Error:", e);
    }
}

testRawApi();
