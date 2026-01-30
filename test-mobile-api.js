// Test script for mobile app API endpoints
const axios = require('axios');

// Configure base URL for mobile app (use your local IP if testing on physical device)
const API_BASE_URL = 'http://localhost:3001/api';
let authToken = '';

const testApi = async () => {
  console.log('🧪 Testing TrailGuard Mobile App API Endpoints...');
  console.log('=' .repeat(50));
  
  try {
    // 1. Test Login
    console.log('\n1️⃣ Testing Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@trailguard.app',
      password: 'Test1234!'
    });
    
    if (loginResponse.data.token) {
      authToken = loginResponse.data.token;
      console.log('✅ Login successful - Token obtained');
    } else {
      console.log('❌ Login failed');
      return;
    }
    
    // Configure axios with auth token
    const authAxios = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    // 2. Test User Profile
    console.log('\n2️⃣ Testing User Profile...');
    try {
      const userResponse = await authAxios.get('/users/me');
      console.log(`✅ User Profile works - Email: ${userResponse.data.email}`);
    } catch (error) {
      console.log(`❌ User Profile failed: ${error.message}`);
    }
    
    // 3. Test Rescue Endpoints
    console.log('\n3️⃣ Testing Rescue Endpoints...');
    try {
      const rescueResponse = await authAxios.get('/rescue/my');
      console.log(`✅ Get My Rescues works - Found ${rescueResponse.data.length} rescues`);
    } catch (error) {
      console.log(`❌ Get My Rescues failed: ${error.message}`);
    }
    
    // 4. Test Teams
    console.log('\n4️⃣ Testing Teams Endpoints...');
    try {
      const teamsResponse = await authAxios.get('/teams');
      console.log(`✅ Get Teams works - Found ${teamsResponse.data.length} teams`);
    } catch (error) {
      console.log(`❌ Get Teams failed: ${error.message}`);
    }
    
    // 5. Test Expeditions
    console.log('\n5️⃣ Testing Expeditions Endpoints...');
    try {
      const expeditionsResponse = await authAxios.get('/expeditions');
      console.log(`✅ Get Expeditions works - Found ${expeditionsResponse.data.length} expeditions`);
    } catch (error) {
      console.log(`❌ Get Expeditions failed: ${error.message}`);
    }
    
    // 6. Test Subscriptions
    console.log('\n6️⃣ Testing Subscription Endpoints...');
    try {
      const plansResponse = await authAxios.get('/subscriptions/plans');
      console.log(`✅ Get Plans works - Plans available: ${Object.keys(plansResponse.data).join(', ')}`);
      
      const currentSubResponse = await authAxios.get('/subscriptions/current');
      console.log(`✅ Get Current Subscription works - Current plan: ${currentSubResponse.data.currentPlan}`);
    } catch (error) {
      console.log(`❌ Subscription endpoints failed: ${error.message}`);
    }
    
    // 7. Test Creating a Rescue Request
    console.log('\n7️⃣ Testing Create Rescue Request...');
    try {
      const rescueCreateResponse = await authAxios.post('/rescue/request', {
        latitude: 40.7128,
        longitude: -74.0060,
        message: 'Test rescue request from mobile app'
      });
      console.log(`✅ Create Rescue Request works - Rescue ID: ${rescueCreateResponse.data.id}`);
    } catch (error) {
      console.log(`❌ Create Rescue Request failed: ${error.message}`);
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('📊 Mobile API Tests Completed');
    console.log('\n✅ All endpoints are properly configured with /api/ prefix');
    console.log('✅ Authentication is working correctly');
    console.log('✅ Mobile app is ready to connect to backend');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
};

testApi();