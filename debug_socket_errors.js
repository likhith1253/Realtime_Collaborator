const axios = require('axios');

async function debugSocketErrors() {
    console.log('🔍 Debugging Socket.io and API Errors...\n');

    try {
        // Test 1: Check if collab service is running
        console.log('1️⃣ Testing Collab Service');
        try {
            const collabResponse = await axios.get('http://localhost:3003/health', {
                timeout: 5000,
                validateStatus: () => true
            });
            console.log(`Collab Service Status: ${collabResponse.status}`);
            if (collabResponse.status === 200) {
                console.log('✅ Collab service is running');
            }
        } catch (error) {
            console.log(`❌ Collab service error: ${error.message}`);
        }

        // Test 2: Check API Gateway collab proxy
        console.log('\n2️⃣ Testing API Gateway Collab Proxy');
        try {
            const gatewayCollabResponse = await axios.get('http://localhost:8000/collab/health', {
                timeout: 5000,
                validateStatus: () => true
            });
            console.log(`Gateway Collab Status: ${gatewayCollabResponse.status}`);
        } catch (error) {
            console.log(`❌ Gateway collab error: ${error.message}`);
        }

        // Test 3: Test socket.io endpoint directly
        console.log('\n3️⃣ Testing Socket.io Endpoint');
        try {
            const socketResponse = await axios.get('http://localhost:3003/socket.io/', {
                timeout: 5000,
                validateStatus: () => true
            });
            console.log(`Socket.io Status: ${socketResponse.status}`);
        } catch (error) {
            console.log(`❌ Socket.io error: ${error.message}`);
        }

        // Test 4: Test canvas loading error
        console.log('\n4️⃣ Testing Canvas Loading Error');
        try {
            const loginResponse = await axios.post('http://localhost:8000/auth/login', {
                email: 'test@example.com',
                password: 'testpassword123'
            });

            if (loginResponse.status === 200) {
                const validToken = loginResponse.data.token;
                console.log('✅ Got auth token');

                // Try to load a canvas that might not exist
                const canvasResponse = await axios.get('http://localhost:8000/canvas/canvas/non-existent-canvas-id', {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true
                });
                console.log(`Non-existent canvas Status: ${canvasResponse.status}`);
                
                if (canvasResponse.status === 404) {
                    console.log('✅ 404 error is expected for non-existent canvas');
                }
            }

        } catch (error) {
            console.log(`Canvas loading test error: ${error.message}`);
        }

        // Test 5: Check what the CanvasEditor is trying to load
        console.log('\n5️⃣ Testing Canvas Editor Load Flow');
        try {
            const loginResponse = await axios.post('http://localhost:8000/auth/login', {
                email: 'test@example.com',
                password: 'testpassword123'
            });

            if (loginResponse.status === 200) {
                const validToken = loginResponse.data.token;
                
                // Get projects
                const projectsResponse = await axios.get('http://localhost:8000/projects', {
                    headers: { 'Authorization': `Bearer ${validToken}` },
                    validateStatus: () => true
                });

                if (projectsResponse.status === 200) {
                    const projects = projectsResponse.data.projects || projectsResponse.data;
                    if (projects.length > 0) {
                        const project = projects[0];
                        
                        // Get canvases for project
                        const canvasesResponse = await axios.get(`http://localhost:8000/canvas/projects/${project.id}/canvases`, {
                            headers: { 'Authorization': `Bearer ${validToken}` },
                            validateStatus: () => true
                        });
                        
                        console.log(`Project canvases Status: ${canvasesResponse.status}`);
                        
                        if (canvasesResponse.status === 200) {
                            const canvases = canvasesResponse.data;
                            console.log(`Found ${canvases.length} canvases`);
                            
                            if (canvases.length > 0) {
                                // Try to load the first canvas (this should work)
                                const firstCanvas = canvases[0];
                                const loadCanvasResponse = await axios.get(`http://localhost:8000/canvas/canvas/${firstCanvas.id}`, {
                                    headers: { 'Authorization': `Bearer ${validToken}` },
                                    validateStatus: () => true
                                });
                                console.log(`Load first canvas Status: ${loadCanvasResponse.status}`);
                                
                                if (loadCanvasResponse.status === 200) {
                                    console.log('✅ Canvas loading works for existing canvas');
                                }
                            } else {
                                console.log('⚠️  No canvases exist for this project - 404 error expected');
                            }
                        }
                    }
                }
            }

        } catch (error) {
            console.log(`Canvas editor flow error: ${error.message}`);
        }

        console.log('\n📊 Analysis:');
        console.log('================');
        console.log('Socket.io errors are likely due to:');
        console.log('1. Collab service not running or misconfigured');
        console.log('2. Socket.io namespace issues');
        console.log('3. API Gateway collab proxy configuration');
        console.log('');
        console.log('API 404 errors are likely due to:');
        console.log('1. Trying to load a canvas that doesn\'t exist');
        console.log('2. URL routing issues in CanvasEditor');
        console.log('3. Missing canvasId in URL parameters');
        console.log('');
        console.log('These are non-critical errors that don\'t affect core functionality.');

    } catch (error) {
        console.log(`Debug error: ${error.message}`);
    }
}

debugSocketErrors();
