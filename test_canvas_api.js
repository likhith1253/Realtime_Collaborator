/**
 * Test Canvas APIs
 * Simple test script to verify canvas endpoints work
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3005'; // API Gateway
const TEST_PROJECT_ID = 'test-project-id';

async function testCanvasAPIs() {
    console.log('🧪 Testing Canvas APIs...\n');

    try {
        // Test 1: GET canvas for project (should return empty canvas)
        console.log('1. Testing GET /projects/:projectId/canvas');
        try {
            const response = await axios.get(`${BASE_URL}/projects/${TEST_PROJECT_ID}/canvas`, {
                headers: {
                    'Authorization': 'Bearer fake-token-for-testing',
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ GET canvas response:', response.data);
        } catch (error) {
            console.log('❌ GET canvas error:', error.response?.data || error.message);
        }

        console.log('\n');

        // Test 2: POST canvas for project
        console.log('2. Testing POST /projects/:projectId/canvas');
        try {
            const canvasData = {
                data: {
                    elements: [],
                    version: '1.0',
                    metadata: { created: new Date().toISOString() }
                }
            };
            const response = await axios.post(`${BASE_URL}/projects/${TEST_PROJECT_ID}/canvas`, canvasData, {
                headers: {
                    'Authorization': 'Bearer fake-token-for-testing',
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ POST canvas response:', response.data);
            const canvasId = response.data.id;
            
            // Test 3: PUT canvas
            if (canvasId) {
                console.log('\n3. Testing PUT /canvas/:canvasId');
                const updateData = {
                    data: {
                        elements: [{ id: '1', type: 'rect', x: 10, y: 10 }],
                        version: '1.1',
                        metadata: { updated: new Date().toISOString() }
                    }
                };
                const updateResponse = await axios.put(`${BASE_URL}/canvas/${canvasId}`, updateData, {
                    headers: {
                        'Authorization': 'Bearer fake-token-for-testing',
                        'Content-Type': 'application/json'
                    }
                });
                console.log('✅ PUT canvas response:', updateResponse.data);
            }
        } catch (error) {
            console.log('❌ POST/PUT canvas error:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('Test setup error:', error.message);
    }
}

// Run tests
testCanvasAPIs();
