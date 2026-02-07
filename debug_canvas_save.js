const axios = require('axios');

async function debugCanvasSave() {
    console.log('🔍 Debugging Canvas Save Issue...\n');

    try {
        // Get auth token
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            const validToken = loginResponse.data.token;
            console.log('✅ Got valid token');

            // Get a project
            const projectsResponse = await axios.get('http://localhost:8000/projects', {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });

            if (projectsResponse.status === 200) {
                const projects = projectsResponse.data.projects || projectsResponse.data;
                if (projects.length > 0) {
                    const project = projects[0];
                    console.log(`Using project: ${project.name}`);

                    // Test 1: Create a new canvas
                    console.log('\n1️⃣ Creating New Canvas');
                    const createResponse = await axios.post(`http://localhost:8000/canvas/projects/${project.id}/canvas`, {
                        data: { items: [] },
                        name: 'Debug Test Canvas'
                    }, {
                        headers: { 'Authorization': `Bearer ${validToken}` },
                        validateStatus: () => true
                    });

                    if (createResponse.status === 201) {
                        const canvasId = createResponse.data.id;
                        console.log(`✅ Canvas created: ${canvasId}`);
                        console.log(`Initial data: ${JSON.stringify(createResponse.data.data)}`);

                        // Test 2: Update canvas with drawing data (simulating frontend save)
                        console.log('\n2️⃣ Testing Canvas Update (Save)');
                        const drawingData = {
                            items: [
                                {
                                    id: 'test-rect-1',
                                    type: 'rect',
                                    x: 100,
                                    y: 100,
                                    width: 150,
                                    height: 100,
                                    fill: '#3b82f6',
                                    stroke: '#1e40af',
                                    strokeWidth: 2
                                },
                                {
                                    id: 'test-circle-1',
                                    type: 'circle',
                                    x: 300,
                                    y: 200,
                                    radius: 50,
                                    fill: '#ef4444',
                                    stroke: '#991b1b',
                                    strokeWidth: 3
                                }
                            ]
                        };

                        const updateResponse = await axios.put(`http://localhost:8000/canvas/canvas/${canvasId}`, {
                            data: drawingData
                        }, {
                            headers: { 'Authorization': `Bearer ${validToken}` },
                            validateStatus: () => true
                        });

                        console.log(`Update Status: ${updateResponse.status}`);
                        if (updateResponse.status === 200) {
                            console.log('✅ Canvas update successful');
                            console.log(`Updated data: ${JSON.stringify(updateResponse.data.data)}`);
                        } else {
                            console.log(`❌ Canvas update failed: ${updateResponse.status}`);
                            console.log(`Response: ${JSON.stringify(updateResponse.data)}`);
                        }

                        // Test 3: Retrieve canvas to verify persistence
                        console.log('\n3️⃣ Testing Canvas Retrieval (Persistence Check)');
                        const getResponse = await axios.get(`http://localhost:8000/canvas/canvas/${canvasId}`, {
                            headers: { 'Authorization': `Bearer ${validToken}` },
                            validateStatus: () => true
                        });

                        console.log(`Retrieval Status: ${getResponse.status}`);
                        if (getResponse.status === 200) {
                            const retrievedItems = getResponse.data.data.items || [];
                            console.log(`✅ Canvas retrieved successfully`);
                            console.log(`Retrieved items count: ${retrievedItems.length}`);
                            
                            if (retrievedItems.length === 2) {
                                console.log('✅ Data persistence VERIFIED - drawings saved!');
                                retrievedItems.forEach((item, index) => {
                                    console.log(`  Item ${index + 1}: ${item.type} at (${item.x}, ${item.y})`);
                                });
                            } else {
                                console.log('❌ Data persistence FAILED - items not saved');
                                console.log(`Expected 2 items, got ${retrievedItems.length}`);
                            }
                        } else {
                            console.log(`❌ Canvas retrieval failed: ${getResponse.status}`);
                            console.log(`Response: ${JSON.stringify(getResponse.data)}`);
                        }

                        // Test 4: Test the exact API call the frontend makes
                        console.log('\n4️⃣ Testing Frontend API Call Format');
                        try {
                            const frontendUpdateResponse = await axios.put(`http://localhost:8000/canvas/canvas/${canvasId}`, {
                                data: { items: drawingData.items }
                            }, {
                                headers: { 
                                    'Authorization': `Bearer ${validToken}`,
                                    'Content-Type': 'application/json'
                                },
                                validateStatus: () => true
                            });

                            console.log(`Frontend Update Status: ${frontendUpdateResponse.status}`);
                            if (frontendUpdateResponse.status === 200) {
                                console.log('✅ Frontend API format works');
                            } else {
                                console.log(`❌ Frontend API format failed: ${frontendUpdateResponse.status}`);
                                console.log(`Response: ${JSON.stringify(frontendUpdateResponse.data)}`);
                            }

                        } catch (error) {
                            console.log(`Frontend API Error: ${error.message}`);
                        }

                    } else {
                        console.log(`❌ Canvas creation failed: ${createResponse.status}`);
                    }
                }
            }

        }

    } catch (error) {
        console.log(`Debug Error: ${error.message}`);
    }
}

debugCanvasSave();
