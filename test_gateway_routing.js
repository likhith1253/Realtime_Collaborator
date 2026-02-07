const axios = require('axios');

async function testGatewayRouting() {
    console.log('🔀 Testing API Gateway Routing...\n');

    try {
        // Test 1: Direct document service call
        console.log('1️⃣ Testing Document Service Directly');
        try {
            const response = await axios.get('http://localhost:3002/canvas/invalid-id', {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log('Direct Service - Status:', response.status);
            console.log('Direct Service - Content-Type:', response.headers['content-type']);
            console.log('Direct Service - Response:', response.data.substring(0, 100));

        } catch (error) {
            console.log('❌ Direct service failed:', error.message);
        }

        // Test 2: Through API Gateway
        console.log('\n2️⃣ Testing Through API Gateway');
        try {
            const response = await axios.get('http://localhost:8000/canvas/canvas/invalid-id', {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log('Gateway - Status:', response.status);
            console.log('Gateway - Content-Type:', response.headers['content-type']);
            console.log('Gateway - Response:', response.data.substring(0, 100));

            if (response.status === 404 && response.headers['content-type'].includes('text/html')) {
                console.log('🚨 API Gateway is returning HTML instead of JSON!');
            }

        } catch (error) {
            console.log('❌ Gateway failed:', error.message);
        }

        // Test 3: Test working canvas route through gateway
        console.log('\n3️⃣ Testing Working Canvas Route Through Gateway');
        try {
            const response = await axios.get('http://localhost:8000/canvas/projects/test-project/canvases', {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log('Gateway Canvas List - Status:', response.status);
            console.log('Gateway Canvas List - Content-Type:', response.headers['content-type']);
            console.log('Gateway Canvas List - Response:', response.data.substring(0, 100));

        } catch (error) {
            console.log('❌ Gateway canvas list failed:', error.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testGatewayRouting();
