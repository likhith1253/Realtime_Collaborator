const axios = require('axios');

async function testRealFrontendCalls() {
    console.log('🔍 Testing Real Frontend API Calls...\n');

    const testProjectId = 'test-project-123';

    // Test 1: Documents API call (what getProjectDocuments calls)
    console.log('1️⃣ Testing Documents API Call');
    try {
        const docsResponse = await axios.get(`http://localhost:8000/projects/${testProjectId}/documents`, {
            headers: { 'Authorization': 'Bearer test-token' },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log(`Documents API Status: ${docsResponse.status}`);
        console.log(`Documents API Content-Type: ${docsResponse.headers['content-type']}`);
        console.log(`Documents API Response: ${docsResponse.data.substring(0, 200)}`);

        if (docsResponse.status === 500) {
            console.log('❌ Documents API returning 500 - this is the issue!');
            try {
                const parsed = JSON.parse(docsResponse.data);
                console.log('500 Error Details:', JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log('500 Raw Response:', docsResponse.data);
            }
        }

    } catch (error) {
        console.log(`Documents API Error: ${error.message}`);
    }

    // Test 2: Project API call (what documents page calls for project name)
    console.log('\n2️⃣ Testing Project API Call');
    try {
        const projectResponse = await axios.get(`http://localhost:8000/projects/${testProjectId}`, {
            headers: { 'Authorization': 'Bearer test-token' },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log(`Project API Status: ${projectResponse.status}`);
        console.log(`Project API Content-Type: ${projectResponse.headers['content-type']}`);
        console.log(`Project API Response: ${projectResponse.data.substring(0, 200)}`);

        if (projectResponse.status === 500) {
            console.log('❌ Project API returning 500 - this is the issue!');
            try {
                const parsed = JSON.parse(projectResponse.data);
                console.log('500 Error Details:', JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log('500 Raw Response:', projectResponse.data);
            }
        }

    } catch (error) {
        console.log(`Project API Error: ${error.message}`);
    }

    // Test 3: Canvas API calls
    console.log('\n3️⃣ Testing Canvas API Calls');
    try {
        const canvasResponse = await axios.get(`http://localhost:8000/canvas/projects/${testProjectId}/canvases`, {
            headers: { 'Authorization': 'Bearer test-token' },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log(`Canvas API Status: ${canvasResponse.status}`);
        console.log(`Canvas API Content-Type: ${canvasResponse.headers['content-type']}`);
        console.log(`Canvas API Response: ${canvasResponse.data.substring(0, 200)}`);

        if (canvasResponse.status === 500) {
            console.log('❌ Canvas API returning 500 - this is the issue!');
            try {
                const parsed = JSON.parse(canvasResponse.data);
                console.log('500 Error Details:', JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log('500 Raw Response:', canvasResponse.data);
            }
        }

    } catch (error) {
        console.log(`Canvas API Error: ${error.message}`);
    }

    // Test 4: Test with valid authentication
    console.log('\n4️⃣ Testing with Valid Authentication');
    try {
        // Get valid token
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            const validToken = loginResponse.data.token;
            console.log('✅ Got valid token, testing real frontend calls...');

            // Test documents with valid token
            const docsValidResponse = await axios.get(`http://localhost:8000/projects/${testProjectId}/documents`, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });
            console.log(`Documents with valid token: Status ${docsValidResponse.status}`);

            // Test project with valid token
            const projectValidResponse = await axios.get(`http://localhost:8000/projects/${testProjectId}`, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });
            console.log(`Project with valid token: Status ${projectValidResponse.status}`);

            // Test canvas with valid token
            const canvasValidResponse = await axios.get(`http://localhost:8000/canvas/projects/${testProjectId}/canvases`, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });
            console.log(`Canvas with valid token: Status ${canvasValidResponse.status}`);

            if (docsValidResponse.status === 200 && projectValidResponse.status === 200 && canvasValidResponse.status === 200) {
                console.log('✅ All frontend API calls working with valid authentication!');
            } else {
                console.log('❌ Some frontend API calls still failing');
            }
        }

    } catch (error) {
        console.log(`Valid token test error: ${error.message}`);
    }
}

testRealFrontendCalls();
