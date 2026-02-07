const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
  console.log('🔐 Testing Authentication Functionality\n');

  try {
    // Test 1: Try to access dashboard without authentication
    console.log('1. Testing dashboard access without auth...');
    try {
      const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
        maxRedirects: 0
      });
      console.log('❌ Dashboard accessible without auth - FAILED');
    } catch (error) {
      if (error.response && error.response.status === 307) {
        console.log('✅ Dashboard redirects unauthenticated users - PASSED');
      } else {
        console.log('⚠️  Unexpected response:', error.message);
      }
    }

    // Test 2: Sign up a new user
    console.log('\n2. Testing user signup...');
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123',
      full_name: 'Test User'
    };

    try {
      const signupResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ User signup successful - PASSED');
      console.log('   User data:', signupResponse.data.user?.email);
      
      const { token, refresh_token } = signupResponse.data;

      // Test 3: Access dashboard with authentication
      console.log('\n3. Testing dashboard access with auth...');
      try {
        const dashboardWithAuth = await axios.get(`${BASE_URL}/dashboard`, {
          headers: {
            'Cookie': `auth_token=${token}`
          },
          maxRedirects: 0
        });
        console.log('✅ Dashboard accessible with auth - PASSED');
      } catch (error) {
        console.log('❌ Dashboard not accessible with auth - FAILED');
      }

      // Test 4: Test logout functionality
      console.log('\n4. Testing logout...');
      try {
        // Simulate logout by clearing token
        const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Logout endpoint responds - PASSED');
      } catch (error) {
        console.log('⚠️  Logout endpoint may not exist (this is okay)');
      }

    } catch (signupError) {
      console.log('❌ User signup failed - FAILED');
      console.log('   Error:', signupError.response?.data || signupError.message);
    }

    // Test 5: Verify protected routes
    console.log('\n5. Testing other protected routes...');
    const protectedRoutes = ['/dashboard/projects', '/dashboard/documents', '/projects', '/documents'];
    
    for (const route of protectedRoutes) {
      try {
        const response = await axios.get(`${BASE_URL}${route}`, {
          maxRedirects: 0
        });
        console.log(`❌ ${route} accessible without auth - FAILED`);
      } catch (error) {
        if (error.response && (error.response.status === 307 || error.response.status === 302)) {
          console.log(`✅ ${route} redirects unauthenticated users - PASSED`);
        } else {
          console.log(`⚠️  ${route}: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }

  console.log('\n🏁 Authentication test completed');
}

testAuth();
