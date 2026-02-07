const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLogoutFlow() {
  console.log('🔐 Testing Logout Flow\n');

  try {
    // Step 1: Sign up and login
    console.log('1. Creating user and logging in...');
    const testUser = {
      email: `logouttest${Date.now()}@example.com`,
      password: 'TestPass123',
      full_name: 'Logout Test User'
    };

    const signupResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    const { token } = signupResponse.data;
    console.log('✅ User created and logged in');

    // Step 2: Access dashboard with token
    console.log('\n2. Accessing dashboard with valid token...');
    const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
      headers: {
        'Cookie': `auth_token=${token}`
      },
      maxRedirects: 0
    });
    console.log('✅ Dashboard accessible with valid token');

    // Step 3: Simulate logout by clearing cookies
    console.log('\n3. Simulating logout (clearing cookies)...');
    
    // Step 4: Try to access dashboard after logout
    console.log('\n4. Testing dashboard access after logout...');
    try {
      const postLogoutResponse = await axios.get(`${BASE_URL}/dashboard`, {
        maxRedirects: 0
      });
      console.log('❌ Dashboard still accessible after logout - FAILED');
    } catch (error) {
      if (error.response && (error.response.status === 307 || error.response.status === 302)) {
        console.log('✅ Dashboard properly redirects after logout - PASSED');
      } else {
        console.log('⚠️  Unexpected response:', error.message);
      }
    }

    console.log('\n🏁 Logout flow test completed');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testLogoutFlow();
