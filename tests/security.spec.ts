import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3002/api';

test.describe('Security: Input Validation & Hardening', () => {

    test('blocks SQL injection attempts in generation URL', async ({ request }) => {
        const response = await request.post(`${API_URL}/generate-captions`, {
            data: {
                blogUrl: "https://example.com'; DROP TABLE users;--",
                workflow: 'social_media'
            },
            headers: {
                'Content-Type': 'application/json',
                // Mock auth if needed, or check if it returns 401/403/400
            }
        });

        // It should be blocked by Zod 400 or Auth 401 (if no auth provided)
        // The key is it should NOT be a 500 or execute the SQL
        expect([400, 401]).toContain(response.status());
    });

    test('blocks long URL payloads (Zod limit)', async ({ request }) => {
        const longUrl = 'https://example.com/' + 'a'.repeat(3000);
        const response = await request.post(`${API_URL}/generate-captions`, {
            data: { blogUrl: longUrl, workflow: 'social_media' }
        });

        expect(response.status()).toBe(400);
    });

    test('blocks invalid workflow types', async ({ request }) => {
        const response = await request.post(`${API_URL}/generate-captions`, {
            data: { blogUrl: 'https://example.com', workflow: 'malicious_workflow' }
        });

        expect(response.status()).toBe(400);
    });

    test('enforces request size limit (1MB)', async ({ request }) => {
        const hugeBody = {
            blogUrl: 'https://example.com',
            workflow: 'social_media',
            context: 'a'.repeat(2 * 1024 * 1024) // 2MB
        };

        const response = await request.post(`${API_URL}/generate-captions`, {
            data: hugeBody
        });

        // Next.js body parser returns 413 for payload too large
        expect(response.status()).toBe(413);
    });
});

test.describe('Security: Headers & CORS', () => {
    test('standard security headers are present', async ({ request }) => {
        const response = await request.get('http://localhost:3002/');
        const headers = response.headers();

        expect(headers['x-content-type-options']).toBe('nosniff');
        expect(headers['x-frame-options']).toBe('DENY');
    });
});
