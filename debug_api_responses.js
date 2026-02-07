const axios = require('axios');

async function debugAPIResponses() {
    console.log('🔍 Debugging API Responses...\n');

    try {
        // Test 1: Canvas list endpoint
        console.log('1️⃣ Testing Canvas List Endpoint');
        try {
            const response = await axios.get('http://localhost:8000/canvas/projects/test-project/canvases', {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true, // Accept any status
                transformResponse: [data => data] // Don't parse JSON automatically
            });

            console.log('Status:', response.status);
            console.log('Headers:', response.headers['content-type']);
            console.log('Response (first 200 chars):', response.data.substring(0, 200));
            
            // Try to parse it manually
            try {
                const parsed = JSON.parse(response.data);
                console.log('✅ Valid JSON:', parsed);
            } catch (e) {
                console.log('❌ Invalid JSON:', e.message);
                console.log('Raw response:', response.data);
            }

        } catch (error) {
            console.log('❌ Request failed:', error.message);
        }

        // Test 2: Documents endpoint
        console.log('\n2️⃣ Testing Documents Endpoint');
        try {
            const response = await axios.get('http://localhost:8000/projects/test-project/documents', {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log('Status:', response.status);
            console.log('Headers:', response.headers['content-type']);
            console.log('Response (first 200 chars):', response.data.substring(0, 200));
            
            try {
                const parsed = JSON.parse(response.data);
                console.log('✅ Valid JSON:', parsed);
            } catch (e) {
                console.log('❌ Invalid JSON:', e.message);
                console.log('Raw response:', response.data);
            }

        } catch (error) {
            console.log('❌ Request failed:', error.message);
        }

        // Test 3: Test without auth to see what error we get
        console.log('\n3️⃣ Testing Without Authentication');
        try {
            const response = await axios.get('http://localhost:8000/canvas/projects/test-project/canvases', {
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log('Status:', response.status);
            console.log('Headers:', response.headers['content-type']);
            console.log('Response (first 200 chars):', response.data.substring(0, 200));
            
            try {
                const parsed = JSON.parse(response.data);
                console.log('✅ Valid JSON:', parsed);
            } catch (e) {
                console.log('❌ Invalid JSON:', e.message);
                console.log('Raw response:', response.data);
            }

        } catch (error) {
            console.log('❌ Request failed:', error.message);
        }

    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
}

debugAPIResponses();
