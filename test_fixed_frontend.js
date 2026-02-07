const axios = require('axios');

async function testFixedFrontend() {
    console.log('🔧 Testing Fixed Frontend Configuration...\n');

    try {
        // Test 1: Get auth token
        console.log('1️⃣ Getting Authentication Token');
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            console.log('✅ Authentication working');
            const validToken = loginResponse.data.token;

            // Test 2: Test projects API (what was failing)
            console.log('\n2️⃣ Testing Projects API (Fixed)');
            const projectsResponse = await axios.get('http://localhost:8000/projects', {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });

            console.log(`Projects Status: ${projectsResponse.status}`);
            
            if (projectsResponse.status === 200) {
                const projects = projectsResponse.data.projects || projectsResponse.data;
                console.log(`✅ Projects Loading! Found ${projects.length} projects:`);
                
                projects.forEach((project, index) => {
                    console.log(`  ${index + 1}. ${project.name} (ID: ${project.id})`);
                });

                if (projects.length > 0) {
                    const firstProject = projects[0];
                    console.log('\n🎯 Testing with Real Project ID');
                    
                    // Test documents with real project
                    const docsResponse = await axios.get(`http://localhost:8000/projects/${firstProject.id}/documents`, {
                        headers: { 'Authorization': `Bearer ${validToken}` },
                        validateStatus: () => true
                    });
                    console.log(`Documents Status: ${docsResponse.status}`);
                    
                    if (docsResponse.status === 200) {
                        console.log('✅ Documents working!');
                        console.log(`Documents: ${JSON.stringify(docsResponse.data, null, 2)}`);
                    }

                    // Test canvas with real project
                    const canvasResponse = await axios.get(`http://localhost:8000/canvas/projects/${firstProject.id}/canvases`, {
                        headers: { 'Authorization': `Bearer ${validToken}` },
                        validateStatus: () => true
                    });
                    console.log(`Canvas Status: ${canvasResponse.status}`);
                    
                    if (canvasResponse.status === 200) {
                        console.log('✅ Canvas working!');
                        console.log(`Canvases: ${JSON.stringify(canvasResponse.data, null, 2)}`);
                    } else if (canvasResponse.status === 404) {
                        console.log('✅ Canvas working (404 expected - no canvases yet)');
                    }

                    // Create a canvas
                    const createCanvasResponse = await axios.post(`http://localhost:8000/canvas/projects/${firstProject.id}/canvas`, {
                        data: {
                            items: [
                                {
                                    id: 'test-rect',
                                    type: 'rect',
                                    x: 100,
                                    y: 100,
                                    width: 150,
                                    height: 100,
                                    fill: '#10b981'
                                }
                            ]
                        },
                        name: 'Test Canvas from Fixed Frontend'
                    }, {
                        headers: { 'Authorization': `Bearer ${validToken}` },
                        validateStatus: () => true
                    });
                    console.log(`Create Canvas Status: ${createCanvasResponse.status}`);
                    
                    if (createCanvasResponse.status === 201) {
                        console.log('✅ Canvas creation working!');
                        console.log(`Created Canvas: ${JSON.stringify(createCanvasResponse.data, null, 2)}`);
                    }
                }

            } else {
                console.log(`❌ Projects still failing: Status ${projectsResponse.status}`);
            }

        } else {
            console.log('❌ Authentication failed');
        }

    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

testFixedFrontend();
