const axios = require('axios');

async function testWebAppEndpoints() {
    console.log('🌐 Testing Web App Frontend Endpoints...\n');

    // Test 1: Check if web app is accessible
    console.log('1️⃣ Testing Web App Accessibility');
    try {
        const webResponse = await axios.get('http://localhost:3000', {
            timeout: 5000,
            validateStatus: () => true
        });
        
        if (webResponse.status === 200) {
            console.log('✅ Web App: Accessible');
        } else {
            console.log(`⚠️  Web App: Status ${webResponse.status}`);
        }
    } catch (error) {
        console.log(`❌ Web App Error: ${error.message}`);
        return;
    }

    // Test 2: Test API Gateway connectivity (what web app uses)
    console.log('\n2️⃣ Testing API Gateway Connectivity');
    try {
        const apiResponse = await axios.get('http://localhost:8000/health');
        console.log('✅ API Gateway: Accessible');
    } catch (error) {
        console.log(`❌ API Gateway Error: ${error.message}`);
        return;
    }

    // Test 3: Test authentication flow (web app login)
    console.log('\n3️⃣ Testing Authentication Flow');
    try {
        // Test signup
        const signupResponse = await axios.post('http://localhost:8000/auth/register', {
            email: 'test@example.com',
            password: 'testpassword123',
            full_name: 'Test User'
        }, {
            validateStatus: () => true
        });

        if (signupResponse.status === 201 || signupResponse.status === 409) {
            console.log('✅ Auth Signup: Working');
        } else {
            console.log(`⚠️  Auth Signup: Status ${signupResponse.status}`);
        }

        // Test login
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        }, {
            validateStatus: () => true
        });

        if (loginResponse.status === 200) {
            console.log('✅ Auth Login: Working');
            const token = loginResponse.data.token;
            
            // Test authenticated API calls with real token
            await testAuthenticatedAPIs(token);
        } else {
            console.log(`⚠️  Auth Login: Status ${loginResponse.status}`);
        }

    } catch (error) {
        console.log(`❌ Auth Error: ${error.message}`);
    }

    // Test 4: Test project creation and canvas flow
    console.log('\n4️⃣ Testing Project & Canvas Flow');
    await testProjectCanvasFlow();

    console.log('\n📊 Web App Test Results:');
    console.log('========================');
}

async function testAuthenticatedAPIs(token) {
    console.log('\n🔐 Testing Authenticated APIs');
    
    try {
        // Test projects API
        const projectsResponse = await axios.get('http://localhost:8000/projects', {
            headers: { 'Authorization': `Bearer ${token}` },
            validateStatus: () => true
        });
        console.log(`✅ Projects API: Status ${projectsResponse.status}`);

        // Test documents API
        const docsResponse = await axios.get('http://localhost:8000/projects/test-project/documents', {
            headers: { 'Authorization': `Bearer ${token}` },
            validateStatus: () => true
        });
        console.log(`✅ Documents API: Status ${docsResponse.status}, JSON: ${docsResponse.headers['content-type'].includes('application/json')}`);

        // Test canvas APIs
        const canvasResponse = await axios.get('http://localhost:8000/canvas/projects/test-project/canvases', {
            headers: { 'Authorization': `Bearer ${token}` },
            validateStatus: () => true
        });
        console.log(`✅ Canvas API: Status ${canvasResponse.status}, JSON: ${canvasResponse.headers['content-type'].includes('application/json')}`);

    } catch (error) {
        console.log(`❌ Authenticated API Error: ${error.message}`);
    }
}

async function testProjectCanvasFlow() {
    try {
        // Create a test project
        const projectResponse = await axios.post('http://localhost:8000/projects', {
            name: 'Test Project for Canvas',
            description: 'Testing canvas functionality'
        }, {
            headers: { 'Authorization': 'Bearer test-token' },
            validateStatus: () => true
        });

        if (projectResponse.status === 201) {
            const projectId = projectResponse.data.id;
            console.log(`✅ Project Creation: Working (ID: ${projectId})`);

            // Test canvas creation in project
            const canvasResponse = await axios.post(`http://localhost:8000/canvas/projects/${projectId}/canvas`, {
                data: {
                    items: [
                        {
                            id: 'browser-test-rect',
                            type: 'rect',
                            x: 50,
                            y: 50,
                            width: 100,
                            height: 80,
                            fill: '#10b981'
                        }
                    ]
                },
                name: 'Browser Test Canvas'
            }, {
                headers: { 'Authorization': 'Bearer test-token' },
                validateStatus: () => true
            });

            if (canvasResponse.status === 201) {
                console.log(`✅ Canvas Creation: Working (ID: ${canvasResponse.data.id})`);

                // Test canvas update (simulating browser drawing)
                const updateResponse = await axios.put(`http://localhost:8000/canvas/canvas/${canvasResponse.data.id}`, {
                    data: {
                        items: [
                            ...canvasResponse.data.data.items,
                            {
                                id: 'browser-test-circle',
                                type: 'circle',
                                x: 200,
                                y: 100,
                                radius: 40,
                                fill: '#ef4444'
                            }
                        ]
                    }
                }, {
                    headers: { 'Authorization': 'Bearer test-token' },
                    validateStatus: () => true
                });

                if (updateResponse.status === 200) {
                    console.log('✅ Canvas Update: Working');

                    // Test canvas retrieval (simulating browser refresh)
                    const getResponse = await axios.get(`http://localhost:8000/canvas/canvas/${canvasResponse.data.id}`, {
                        headers: { 'Authorization': 'Bearer test-token' },
                        validateStatus: () => true
                    });

                    if (getResponse.status === 200) {
                        const itemCount = getResponse.data.data.items?.length || 0;
                        console.log(`✅ Canvas Retrieval: Working (${itemCount} items persisted)`);
                        
                        if (itemCount >= 2) {
                            console.log('✅ Data Persistence: VERIFIED - Drawings saved and retrieved');
                        }
                    }
                }
            }

            // Test documents navigation from project
            const docsNavResponse = await axios.get(`http://localhost:8000/projects/${projectId}/documents`, {
                headers: { 'Authorization': 'Bearer test-token' },
                validateStatus: () => true
            });
            
            if (docsNavResponse.headers['content-type'].includes('application/json')) {
                console.log('✅ Documents Navigation: Working (JSON response)');
            } else {
                console.log('❌ Documents Navigation: Still returning HTML');
            }

        } else {
            console.log(`⚠️  Project Creation: Status ${projectResponse.status}`);
        }

    } catch (error) {
        console.log(`❌ Project/Canvas Flow Error: ${error.message}`);
    }
}

testWebAppEndpoints();
