const axios = require('axios');

async function debugPathRewrite() {
    console.log('🔍 Debugging Path Rewrite...\n');

    // Test the exact path that's failing
    console.log('1️⃣ Testing failing route: /canvas/canvas/test-id');
    
    try {
        const response = await axios.get('http://localhost:8000/canvas/canvas/test-id', {
            headers: {
                'Authorization': 'Bearer test-token'
            },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers['content-type']);
        
        if (response.headers['content-type'].includes('text/html')) {
            console.log('❌ Got HTML response - path rewrite issue!');
            console.log('HTML Response:', response.data.substring(0, 300));
        } else {
            console.log('✅ Got JSON response');
            console.log('JSON Response:', response.data);
        }

    } catch (error) {
        console.log('❌ Request failed:', error.message);
    }

    // Test what the document service expects
    console.log('\n2️⃣ Testing document service directly: /canvas/test-id');
    
    try {
        const response = await axios.get('http://localhost:3002/canvas/test-id', {
            headers: {
                'Authorization': 'Bearer test-token'
            },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log('Direct Service Status:', response.status);
        console.log('Direct Service Content-Type:', response.headers['content-type']);
        console.log('Direct Service Response:', response.data.substring(0, 200));

    } catch (error) {
        console.log('❌ Direct service failed:', error.message);
    }

    // Test a working route for comparison
    console.log('\n3️⃣ Testing working route: /canvas/projects/test/canvases');
    
    try {
        const response = await axios.get('http://localhost:8000/canvas/projects/test/canvases', {
            headers: {
                'Authorization': 'Bearer test-token'
            },
            validateStatus: () => true,
            transformResponse: [data => data]
        });

        console.log('Working Route Status:', response.status);
        console.log('Working Route Content-Type:', response.headers['content-type']);
        console.log('Working Route Response:', response.data.substring(0, 200));

    } catch (error) {
        console.log('❌ Working route failed:', error.message);
    }

    console.log('\n📊 Analysis:');
    console.log('- If /canvas/canvas/test-id fails but /canvas/test-id works, pathRewrite is the issue');
    console.log('- If both fail the same way, the issue is elsewhere');
}

debugPathRewrite();
