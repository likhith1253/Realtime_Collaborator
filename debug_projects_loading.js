const axios = require('axios');

async function debugProjectsLoading() {
    console.log('🔍 Debugging Projects Loading...\n');

    // Test 1: Check if we can get auth token
    console.log('1️⃣ Testing Authentication');
    try {
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            console.log('✅ Authentication working');
            const validToken = loginResponse.data.token;

            // Test 2: Test projects API directly
            console.log('\n2️⃣ Testing Projects API');
            try {
                const projectsResponse = await axios.get('http://localhost:8000/projects', {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });

                console.log(`Projects API Status: ${projectsResponse.status}`);
                console.log(`Projects API Response: ${projectsResponse.data}`);

                if (projectsResponse.status === 500) {
                    try {
                        const parsed = JSON.parse(projectsResponse.data);
                        console.log('Projects 500 Error:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('Projects 500 Raw:', projectsResponse.data);
                    }
                }

            } catch (error) {
                console.log(`Projects API Error: ${error.message}`);
            }

            // Test 3: Test document service directly
            console.log('\n3️⃣ Testing Document Service Directly');
            try {
                const directResponse = await axios.get('http://localhost:3002/projects', {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });

                console.log(`Direct Projects Status: ${directResponse.status}`);
                console.log(`Direct Projects Response: ${directResponse.data}`);

                if (directResponse.status === 500) {
                    try {
                        const parsed = JSON.parse(directResponse.data);
                        console.log('Direct Projects 500 Error:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('Direct Projects 500 Raw:', directResponse.data);
                    }
                }

            } catch (error) {
                console.log(`Direct Projects Error: ${error.message}`);
            }

            // Test 4: Test API Gateway projects proxy
            console.log('\n4️⃣ Testing API Gateway Projects Proxy');
            try {
                const gatewayResponse = await axios.get('http://localhost:8000/projects', {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });

                console.log(`Gateway Projects Status: ${gatewayResponse.status}`);
                console.log(`Gateway Projects Response: ${gatewayResponse.data}`);

                if (gatewayResponse.status === 500) {
                    try {
                        const parsed = JSON.parse(gatewayResponse.data);
                        console.log('Gateway Projects 500 Error:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('Gateway Projects 500 Raw:', gatewayResponse.data);
                    }
                }

            } catch (error) {
                console.log(`Gateway Projects Error: ${error.message}`);
            }

            // Test 5: Check what the frontend is actually calling
            console.log('\n5️⃣ Testing Frontend Projects Call');
            try {
                // This simulates what the frontend getProjects() function calls
                const frontendResponse = await axios.get('http://localhost:3000/projects', {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });

                console.log(`Frontend Projects Status: ${frontendResponse.status}`);
                console.log(`Frontend Projects Response: ${frontendResponse.data}`);

                if (frontendResponse.status === 500) {
                    try {
                        const parsed = JSON.parse(frontendResponse.data);
                        console.log('Frontend Projects 500 Error:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('Frontend Projects 500 Raw:', frontendResponse.data);
                    }
                }

            } catch (error) {
                console.log(`Frontend Projects Error: ${error.message}`);
            }

        } else {
            console.log('❌ Authentication failed');
        }

    } catch (error) {
        console.log(`Auth Error: ${error.message}`);
    }
}

debugProjectsLoading();
