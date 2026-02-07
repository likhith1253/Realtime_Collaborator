const axios = require('axios');

async function debugReal500Errors() {
    console.log('🔍 Debugging Real 500 Errors with Valid Auth...\n');

    try {
        // Get valid token
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            const validToken = loginResponse.data.token;
            console.log('✅ Got valid token');

            // Test Documents API 500 error
            console.log('\n1️⃣ Debugging Documents API 500 Error');
            const docsResponse = await axios.get(`http://localhost:8000/projects/test-project-123/documents`, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log(`Documents Status: ${docsResponse.status}`);
            console.log(`Documents Response: ${docsResponse.data}`);

            if (docsResponse.status === 500) {
                try {
                    const parsed = JSON.parse(docsResponse.data);
                    console.log('Documents 500 Error:', JSON.stringify(parsed, null, 2));
                } catch (e) {
                    console.log('Documents 500 Raw:', docsResponse.data);
                }
            }

            // Test Project API 500 error
            console.log('\n2️⃣ Debugging Project API 500 Error');
            const projectResponse = await axios.get(`http://localhost:8000/projects/test-project-123`, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log(`Project Status: ${projectResponse.status}`);
            console.log(`Project Response: ${projectResponse.data}`);

            if (projectResponse.status === 500) {
                try {
                    const parsed = JSON.parse(projectResponse.data);
                    console.log('Project 500 Error:', JSON.stringify(parsed, null, 2));
                } catch (e) {
                    console.log('Project 500 Raw:', projectResponse.data);
                }
            }

            // Test Canvas API 500 error
            console.log('\n3️⃣ Debugging Canvas API 500 Error');
            const canvasResponse = await axios.get(`http://localhost:8000/canvas/projects/test-project-123/canvases`, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true,
                transformResponse: [data => data]
            });

            console.log(`Canvas Status: ${canvasResponse.status}`);
            console.log(`Canvas Response: ${canvasResponse.data}`);

            if (canvasResponse.status === 500) {
                try {
                    const parsed = JSON.parse(canvasResponse.data);
                    console.log('Canvas 500 Error:', JSON.stringify(parsed, null, 2));
                } catch (e) {
                    console.log('Canvas 500 Raw:', canvasResponse.data);
                }
            }

            // Test the document service directly
            console.log('\n4️⃣ Testing Document Service Directly');
            try {
                const directDocsResponse = await axios.get(`http://localhost:3002/projects/test-project-123/documents`, {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });

                console.log(`Direct Documents Status: ${directDocsResponse.status}`);
                console.log(`Direct Documents Response: ${directDocsResponse.data}`);

            } catch (error) {
                console.log(`Direct Documents Error: ${error.message}`);
            }

        }

    } catch (error) {
        console.log(`Debug Error: ${error.message}`);
    }
}

debugReal500Errors();
