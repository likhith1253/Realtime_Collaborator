const axios = require('axios');

async function debug500Errors() {
    console.log('🔍 Debugging 500 Errors...\n');

    // Test documents API 500 error
    console.log('1️⃣ Debugging Documents API 500 Error');
    try {
        const docsResponse = await axios.get('http://localhost:8000/projects/test-project/documents', {
            headers: { 'Authorization': 'Bearer test-token' },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log(`Documents Status: ${docsResponse.status}`);
        console.log(`Documents Response: ${docsResponse.data.substring(0, 300)}`);

        if (docsResponse.status === 500) {
            try {
                const parsed = JSON.parse(docsResponse.data);
                console.log('Documents 500 Error Details:', parsed);
            } catch (e) {
                console.log('Documents 500 Raw Response:', docsResponse.data);
            }
        }

    } catch (error) {
        console.log(`Documents Error: ${error.message}`);
    }

    // Test canvas API 500 error
    console.log('\n2️⃣ Debugging Canvas API 500 Error');
    try {
        const canvasResponse = await axios.get('http://localhost:8000/canvas/projects/test-project/canvases', {
            headers: { 'Authorization': 'Bearer test-token' },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log(`Canvas Status: ${canvasResponse.status}`);
        console.log(`Canvas Response: ${canvasResponse.data.substring(0, 300)}`);

        if (canvasResponse.status === 500) {
            try {
                const parsed = JSON.parse(canvasResponse.data);
                console.log('Canvas 500 Error Details:', parsed);
            } catch (e) {
                console.log('Canvas 500 Raw Response:', canvasResponse.data);
            }
        }

    } catch (error) {
        console.log(`Canvas Error: ${error.message}`);
    }

    // Test project creation 401 error
    console.log('\n3️⃣ Debugging Project Creation 401 Error');
    try {
        const projectResponse = await axios.post('http://localhost:8000/projects', {
            name: 'Test Project',
            description: 'Test'
        }, {
            headers: { 'Authorization': 'Bearer test-token' },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log(`Project Status: ${projectResponse.status}`);
        console.log(`Project Response: ${projectResponse.data.substring(0, 300)}`);

        if (projectResponse.status === 401) {
            try {
                const parsed = JSON.parse(projectResponse.data);
                console.log('Project 401 Error Details:', parsed);
            } catch (e) {
                console.log('Project 401 Raw Response:', projectResponse.data);
            }
        }

    } catch (error) {
        console.log(`Project Error: ${error.message}`);
    }

    // Test with valid auth token
    console.log('\n4️⃣ Testing with Valid Auth Token');
    try {
        // First login to get valid token
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            const validToken = loginResponse.data.token;
            console.log('✅ Got valid token, testing APIs...');

            // Test documents with valid token
            const docsValidResponse = await axios.get('http://localhost:8000/projects/test-project/documents', {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });
            console.log(`Documents with valid token: Status ${docsValidResponse.status}`);

            // Test canvas with valid token
            const canvasValidResponse = await axios.get('http://localhost:8000/canvas/projects/test-project/canvases', {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });
            console.log(`Canvas with valid token: Status ${canvasValidResponse.status}`);

            // Test project creation with valid token
            const projectValidResponse = await axios.post('http://localhost:8000/projects', {
                name: 'Valid Token Test Project',
                description: 'Testing with valid token'
            }, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });
            console.log(`Project creation with valid token: Status ${projectValidResponse.status}`);

            if (projectValidResponse.status === 201) {
                console.log('✅ All APIs working with valid authentication!');
            }
        }

    } catch (error) {
        console.log(`Valid token test error: ${error.message}`);
    }
}

debug500Errors();
