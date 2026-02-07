const axios = require('axios');

async function debugCanvasCreation() {
    console.log('🔍 Debugging Canvas Creation...\n');

    const realProjectId = '3376a09d-578c-4dee-b257-f1b1c56475f2';

    try {
        // Get valid token
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            const validToken = loginResponse.data.token;
            console.log('✅ Got valid token');

            // Test canvas creation with detailed error info
            console.log('\n🎨 Testing Canvas Creation');
            try {
                const createCanvasResponse = await axios.post(`http://localhost:8000/canvas/projects/${realProjectId}/canvas`, {
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
                    name: 'Test Canvas'
                }, {
                    headers: { 
                        'Authorization': `Bearer ${validToken}`,
                        'Content-Type': 'application/json'
                    },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });

                console.log(`Canvas Creation Status: ${createCanvasResponse.status}`);
                console.log(`Canvas Creation Response: ${createCanvasResponse.data}`);

                if (createCanvasResponse.status === 404 || createCanvasResponse.status === 500) {
                    try {
                        const parsed = JSON.parse(createCanvasResponse.data);
                        console.log('Canvas Creation Error:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('Canvas Creation Raw Error:', createCanvasResponse.data);
                    }
                }

            } catch (error) {
                console.log(`Canvas Creation Error: ${error.message}`);
            }

            // Test canvas list to see if it works
            console.log('\n📋 Testing Canvas List');
            try {
                const canvasListResponse = await axios.get(`http://localhost:8000/canvas/projects/${realProjectId}/canvases`, {
                    headers: { 
                        'Authorization': `Bearer ${validToken}`,
                        'Content-Type': 'application/json'
                    },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });

                console.log(`Canvas List Status: ${canvasListResponse.status}`);
                console.log(`Canvas List Response: ${canvasListResponse.data}`);

                if (canvasListResponse.status === 404 || canvasListResponse.status === 500) {
                    try {
                        const parsed = JSON.parse(canvasListResponse.data);
                        console.log('Canvas List Error:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('Canvas List Raw Error:', canvasListResponse.data);
                    }
                }

            } catch (error) {
                console.log(`Canvas List Error: ${error.message}`);
            }

            // Test the document service directly
            console.log('\n🔧 Testing Document Service Directly');
            try {
                const directCreateResponse = await axios.post(`http://localhost:3002/projects/${realProjectId}/canvas`, {
                    data: {
                        items: [
                            {
                                id: 'test-rect-direct',
                                type: 'rect',
                                x: 100,
                                y: 100,
                                width: 150,
                                height: 100,
                                fill: '#ef4444'
                            }
                        ]
                    },
                    name: 'Direct Test Canvas'
                }, {
                    headers: { 
                        'Authorization': `Bearer ${validToken}`,
                        'Content-Type': 'application/json'
                    },
                    validateStatus: () => true,
                    transformResponse: [data => data]
                });

                console.log(`Direct Canvas Creation Status: ${directCreateResponse.status}`);
                console.log(`Direct Canvas Creation Response: ${directCreateResponse.data}`);

                if (directCreateResponse.status === 404 || directCreateResponse.status === 500) {
                    try {
                        const parsed = JSON.parse(directCreateResponse.data);
                        console.log('Direct Canvas Creation Error:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('Direct Canvas Creation Raw Error:', directCreateResponse.data);
                    }
                }

            } catch (error) {
                console.log(`Direct Canvas Creation Error: ${error.message}`);
            }

        }

    } catch (error) {
        console.log(`Debug Error: ${error.message}`);
    }
}

debugCanvasCreation();
