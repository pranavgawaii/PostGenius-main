#!/usr/bin/env node

/**
 * PostGenius Flow Tester
 * Tests each component of the generation pipeline independently
 */

const https = require('https');

console.log('🔍 PostGenius System Diagnostic\n');
console.log('='.repeat(50));

// Test 1: GitHub API Connectivity
async function testGitHubAPI() {
    console.log('\n📡 Test 1: GitHub API Connectivity');
    console.log('-'.repeat(50));

    const testRepo = 'vercel/next.js'; // Known public repo

    return new Promise((resolve) => {
        const req = https.get(`https://api.github.com/repos/${testRepo}`, {
            headers: {
                'User-Agent': 'PostGenius-Test',
                'Accept': 'application/vnd.github+json'
            },
            timeout: 10000
        }, (res) => {
            console.log(`✅ Status: ${res.statusCode}`);
            console.log(`✅ GitHub API is reachable`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`❌ Error: ${err.message}`);
            console.log(`❌ GitHub API is NOT reachable from Node.js`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`❌ Timeout: Connection timed out`);
            req.destroy();
            resolve(false);
        });
    });
}

// Test 2: Firecrawl API Connectivity
async function testFirecrawlAPI() {
    console.log('\n🔥 Test 2: Firecrawl API Connectivity');
    console.log('-'.repeat(50));

    return new Promise((resolve) => {
        const req = https.get('https://api.firecrawl.dev', {
            timeout: 10000
        }, (res) => {
            console.log(`✅ Status: ${res.statusCode}`);
            console.log(`✅ Firecrawl API is reachable`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`❌ Error: ${err.message}`);
            console.log(`❌ Firecrawl API is NOT reachable from Node.js`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`❌ Timeout: Connection timed out`);
            req.destroy();
            resolve(false);
        });
    });
}

// Test 3: Gemini API Connectivity
async function testGeminiAPI() {
    console.log('\n🤖 Test 3: Gemini API Connectivity');
    console.log('-'.repeat(50));

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log('❌ GEMINI_API_KEY not found in environment');
        return false;
    }

    console.log(`✅ API Key found: ${apiKey.substring(0, 10)}...`);

    return new Promise((resolve) => {
        const req = https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
            timeout: 10000
        }, (res) => {
            console.log(`✅ Status: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log(`✅ Gemini API is reachable and key is valid`);
                resolve(true);
            } else {
                console.log(`❌ Gemini API returned error status`);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            console.log(`❌ Error: ${err.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`❌ Timeout: Connection timed out`);
            req.destroy();
            resolve(false);
        });
    });
}

// Test 4: Environment Variables
function testEnvironment() {
    console.log('\n⚙️  Test 4: Environment Variables');
    console.log('-'.repeat(50));

    const required = [
        'GEMINI_API_KEY',
        'FIRECRAWL_API_KEY',
        'CLERK_SECRET_KEY',
        'NEXT_PUBLIC_SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY'
    ];

    let allPresent = true;

    required.forEach(key => {
        if (process.env[key]) {
            console.log(`✅ ${key}: Present`);
        } else {
            console.log(`❌ ${key}: Missing`);
            allPresent = false;
        }
    });

    return allPresent;
}

// Run all tests
async function runDiagnostics() {
    console.log('\n🚀 Starting diagnostics...\n');

    const envOk = testEnvironment();
    const githubOk = await testGitHubAPI();
    const firecrawlOk = await testFirecrawlAPI();
    const geminiOk = await testGeminiAPI();

    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Environment Variables: ${envOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`GitHub API: ${githubOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Firecrawl API: ${firecrawlOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Gemini API: ${geminiOk ? '✅ PASS' : '❌ FAIL'}`);

    console.log('\n💡 RECOMMENDATIONS:');
    if (!githubOk || !firecrawlOk) {
        console.log('- Node.js cannot reach external APIs (network/firewall issue)');
        console.log('- Try running: export NODE_OPTIONS="--dns-result-order=ipv4first"');
        console.log('- Check VPN/firewall settings');
    }
    if (!geminiOk) {
        console.log('- Check Gemini API key validity');
        console.log('- Verify API quota at https://ai.google.dev/');
    }
    if (!envOk) {
        console.log('- Add missing environment variables to .env.local');
    }

    console.log('\n');
}

// Load .env files
try {
    require('dotenv').config({ path: '.env.local' });
    require('dotenv').config();
} catch (e) {
    console.log('⚠️  dotenv not available, using system environment only');
}

runDiagnostics().catch(console.error);
