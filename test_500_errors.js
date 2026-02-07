const axios = require('axios');

async function test500Errors() {
    console.log('🚨 Testing for 500 Errors...\n');

    try {
        // Test 1: Canvas creation with invalid data
        console.log('1️⃣ Testing Canvas Creation (might trigger 500)');
        try {
            const response = await axios.post('http://localhost:8000/canvas/projects/invalid-project/canvas', {
                data: { items: [] },
                name: 'Test Canvas'
            }, {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log('Status:', response.status);
            console.log('Headers:', response.headers['content-type']);
            console.log('Response (first 500 chars):', response.data.substring(0, 500));
            
            if (response.status === 500) {
                console.log('🚨 Found 500 error!');
                console.log('Raw response:', response.data);
            } else {
                try {
                    const parsed = JSON.parse(response.data);
                    console.log('✅ Valid JSON:', parsed);
                } catch (e) {
                    console.log('❌ Invalid JSON:', e.message);
                    console.log('Raw response:', response.data);
                }
            }

        } catch (error) {
            console.log('❌ Request failed:', error.message);
        }

        // Test 2: Canvas update with invalid ID
        console.log('\n2️⃣ Testing Canvas Update (might trigger 500)');
        try {
            const response = await axios.put('http://localhost:8000/canvas/canvas/invalid-id', {
                data: { items: [] },
                name: 'Updated Canvas'
            }, {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log('Status:', response.status);
            console.log('Headers:', response.headers['content-type']);
            console.log('Response (first 500 chars):', response.data.substring(0, 500));
            
            if (response.status === 500) {
                console.log('🚨 Found 500 error!');
                console.log('Raw response:', response.data);
            } else {
                try {
                    const parsed = JSON.parse(response.data);
                    console.log('✅ Valid JSON:', parsed);
                } catch (e) {
                    console.log('❌ Invalid JSON:', e.message);
                    console.log('Raw response:', response.data);
                }
            }

        } catch (error) {
            console.log('❌ Request failed:', error.message);
        }

        // Test 3: Check document service directly for 500 errors
        console.log('\n3️⃣ Testing Document Service Directly');
        try {
            const response = await axios.post('http://localhost:3002/projects/invalid-project/canvas', {
                data: { items: [] },
                name: 'Test Canvas'
            }, {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log('Status:', response.status);
            console.log('Headers:', response.headers['content-type']);
            console.log('Response (first 500 chars):', response.data.substring(0, 500));
            
            if (response.status === 500) {
                console.log('🚨 Found 500 error in document service!');
                console.log('Raw response:', response.data);
            } else {
                try {
                    const parsed = JSON.parse(response.data);
                    console.log('✅ Valid JSON:', parsed);
                } catch (e) {
                    console.log('❌ Invalid JSON:', e.message);
                    console.log('Raw response:', response.data);
                }
            }

        } catch (error) {
            console.log('❌ Request failed:', error.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

test500Errors();
