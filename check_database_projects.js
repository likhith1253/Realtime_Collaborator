const axios = require('axios');

async function checkDatabaseProjects() {
    console.log('🔍 Checking Database Projects...\n');

    try {
        // Get valid token
        const loginResponse = await axios.post('http://localhost:8000/auth/login', {
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (loginResponse.status === 200) {
            const validToken = loginResponse.data.token;
            console.log('✅ Got valid token');

            // Get actual projects from database
            const projectsResponse = await axios.get('http://localhost:8000/projects', {
                headers: { 'Authorization': `Bearer ${validToken}` },
                validateStatus: () => true
            });

            console.log(`Projects Status: ${projectsResponse.status}`);
            
            if (projectsResponse.status === 200) {
                const projects = projectsResponse.data.projects || projectsResponse.data;
                console.log(`Found ${projects.length} projects in database:`);
                
                projects.forEach((project, index) => {
                    console.log(`${index + 1}. ID: ${project.id}`);
                    console.log(`   Name: ${project.name}`);
                    console.log(`   Description: ${project.description || 'None'}`);
                    console.log('');
                });

                if (projects.length > 0) {
                    const firstProject = projects[0];
                    console.log('🎯 Testing with real project ID...');
                    
                    // Test documents with real project ID
                    const docsResponse = await axios.get(`http://localhost:8000/projects/${firstProject.id}/documents`, {
                        headers: { 'Authorization': `Bearer ${validToken}` },
                        validateStatus: () => true
                    });
                    console.log(`Documents with real project ID: Status ${docsResponse.status}`);

                    // Test canvas with real project ID
                    const canvasResponse = await axios.get(`http://localhost:8000/canvas/projects/${firstProject.id}/canvases`, {
                        headers: { 'Authorization': `Bearer ${validToken}` },
                        validateStatus: () => true
                    });
                    console.log(`Canvas with real project ID: Status ${canvasResponse.status}`);

                    if (docsResponse.status === 200 && canvasResponse.status === 200) {
                        console.log('\n✅ SOLUTION FOUND!');
                        console.log('The issue is that you need to navigate to a REAL project ID.');
                        console.log(`Use this URL: http://localhost:3000/projects/${firstProject.id}/documents`);
                        console.log(`Or this URL: http://localhost:3000/projects/${firstProject.id}/canvas`);
                    }
                } else {
                    console.log('❌ No projects found in database. You need to create a project first.');
                    console.log('Go to the dashboard and create a project, then use its ID.');
                }

            } else {
                console.log(`❌ Failed to get projects: Status ${projectsResponse.status}`);
            }

        }

    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

checkDatabaseProjects();
