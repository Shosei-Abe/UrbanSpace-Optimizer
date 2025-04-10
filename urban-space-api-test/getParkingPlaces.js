const axios = require('axios');

const API_KEY = 'AIzaSyACRhy6iJo1obR2Afe-qTy6jaqOpVZKpl4'; // ← あなたのAPIキーに置き換えてね
const location = '47.4979,19.0402'; // Budapest中心
const radius = 1000; // 単位：メートル
const type = 'parking';

async function fetchParkingData() {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    console.log(JSON.stringify(response.data, null, 2)); // ← ここ追加！
    const places = response.data.results;

    places.forEach((place, i) => {
      console.log(`📍 ${i + 1}: ${place.name}`);
      console.log(`   Address: ${place.vicinity}`);
      console.log(`   Location: ${place.geometry.location.lat}, ${place.geometry.location.lng}`);
      console.log(`   Open Now: ${place.opening_hours?.open_now ?? 'Unknown'}`);
      console.log('---');
    });
  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
}

fetchParkingData();
