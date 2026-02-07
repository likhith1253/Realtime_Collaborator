const axios = require('axios');

async function testSpecificRoutes() {
    console.log('🎯 Testing Specific Routes...\n');

    const routes = [
        'GET /canvas/canvas/invalid-id',
        'GET /canvas/projects/test/canvases', 
        'GET /canvas/projects/test/canvas',
        'POST /canvas/projects/test/canvas',
        'PUT /canvas/canvas/test-id'
    ];

    for (const route of routes) {
        const [method, path] = route.split(' ');
        
        console.log(`\n🔍 Testing: ${route}`);
        
        try {
            let response;
            const config = {
                headers: {
                    'Authorization': 'Bearer test-token'
                },
                validateStatus: () => true,
                transformResponse: [data => data]
            };

            if (method === 'GET') {
                response = await axios.get(`http://localhost:8000${path}`, config);
            } else if (method === 'POST') {
                response = await axios.post(`http://localhost:8000${path}`, {}, config);
            } else if (method === 'PUT') {
                response = await axios.put(`http://localhost:8000${path}`, {}, config);
            }

            console.log(`  Status: ${response.status}`);
            console.log(`  Content-Type: ${response.headers['content-type']}`);
            
            if (response.headers['content-type'].includes('application/json')) {
                try {
                    const parsed = JSON.parse(response.data);
                    console.log(`  ✅ Valid JSON: ${JSON.stringify(parsed).substring(0, 100)}...`);
                } catch (e) {
                    console.log(`  ❌ Invalid JSON: ${e.message}`);
                }
            } else {
                console.log(`  ❌ Non-JSON response: ${response.data.substring(0, 100)}...`);
                console.log(`  🚨 This will cause "Invalid JSON response from server" error!`);
            }

        } catch (error) {
            console.log(`  ❌ Request failed: ${error.message}`);
        }
    }

    console.log('\n📊 Summary:');
    console.log('Routes returning JSON will work correctly');
    console.log('Routes returning HTML will cause "Invalid JSON response from server" errors');
}

testSpecificRoutes();
