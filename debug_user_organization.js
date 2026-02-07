const axios = require('axios');

async function debugUserOrganization() {
    console.log('🔍 Debugging User Organization Access...\n');

    try {
        // Get auth token and user info
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            const validToken = loginResponse.data.token;
            console.log('✅ Got valid token');
            console.log('User info:', loginResponse.data.user);

            const userId = loginResponse.data.user.id;
            const realProjectId = '3376a09d-578c-4dee-b257-f1b1c56475f2';

            // Test 1: Check if user can access project via documents API
            console.log('\n📄 Testing Documents API (should work)');
            const docsResponse = await axios.get(`http://localhost:8000/projects/${realProjectId}/documents`, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });
            console.log(`Documents Status: ${docsResponse.status}`);

            // Test 2: Check project details
            console.log('\n🏢 Testing Project Details');
            const projectResponse = await axios.get(`http://localhost:8000/projects/${realProjectId}`, {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });
            console.log(`Project Status: ${projectResponse.status}`);
            if (projectResponse.status === 200) {
                console.log('Project details:', projectResponse.data);
            }

            // Test 3: Check user organizations
            console.log('\n👥 Testing User Organizations');
            try {
                const orgsResponse = await axios.get('http://localhost:8000/organizations', {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true
                });
                console.log(`Organizations Status: ${orgsResponse.status}`);
                if (orgsResponse.status === 200) {
                    console.log('User organizations:', orgsResponse.data);
                }
            } catch (error) {
                console.log(`Organizations Error: ${error.message}`);
            }

            // Test 4: Test canvas API with detailed error
            console.log('\n🎨 Testing Canvas API with User Context');
            try {
                const canvasResponse = await axios.post(`http://localhost:8000/canvas/projects/${realProjectId}/canvas`, {
                    data: { items: [] },
                    name: 'Test Canvas'
                }, {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });
                console.log(`Canvas Status: ${canvasResponse.status}`);
                console.log(`Canvas Response: ${canvasResponse.data}`);

                if (canvasResponse.status === 404) {
                    try {
                        const parsed = JSON.parse(canvasResponse.data);
                        console.log('Canvas Error:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('Canvas Raw Error:', canvasResponse.data);
                    }
                }

            } catch (error) {
                console.log(`Canvas Error: ${error.message}`);
            }

            // Test 5: Try creating a new project and then canvas
            console.log('\n🆕 Testing New Project + Canvas');
            try {
                const newProjectResponse = await axios.post('http://localhost:8000/projects', {
                    name: 'Test Project for Canvas',
                    description: 'Testing canvas creation'
                }, {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true
                });
                console.log(`New Project Status: ${newProjectResponse.status}`);
                
                if (newProjectResponse.status === 201) {
                    const newProjectId = newProjectResponse.data.id;
                    console.log(`Created new project: ${newProjectId}`);
                    
                    // Try canvas with new project
                    const newCanvasResponse = await axios.post(`http://localhost:8000/canvas/projects/${newProjectId}/canvas`, {
                        data: { items: [] },
                        name: 'Test Canvas in New Project'
                    }, {
                        headers: { 'Authorization': `Bearer ${validToken}` },
                        validateStatus: () => true
                    });
                    console.log(`New Canvas Status: ${newCanvasResponse.status}`);
                    
                    if (newCanvasResponse.status === 201) {
                        console.log('✅ Canvas creation works with new project!');
                        console.log(`Canvas: ${JSON.stringify(newCanvasResponse.data, null, 2)}`);
                    }
                }

            } catch (error) {
                console.log(`New Project Error: ${error.message}`);
            }

        }

    } catch (error) {
        console.log(`Debug Error: ${error.message}`);
    }
}

debugUserOrganization();
