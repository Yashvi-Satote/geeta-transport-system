// src/bus-driver-dashboard/utils/geoTracker.js

const DB_KEY = 'busDriverOfflineLocations';

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export function calculateSpeed(prevLocation, newLocation) {
  if (!prevLocation || !newLocation) return 0;
  if (!prevLocation.lat || !newLocation.lat) return 0;

  const dist = getDistance(prevLocation.lat, prevLocation.lng, newLocation.lat, newLocation.lng);
  
  // time diff in hours
  const timeHours = (newLocation.timestamp - prevLocation.timestamp) / (1000 * 60 * 60);
  
  if (timeHours <= 0) return 0;
  return dist / timeHours; 
}

export function getStoredLocations() {
  const data = localStorage.getItem(DB_KEY);
  if (!data) return [];
  
  let locations = [];
  try {
    locations = JSON.parse(data);
  } catch (e) {
    return [];
  }
  
  const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;
  return locations.filter(loc => loc.timestamp >= thirtyMinsAgo);
}

export function saveToLocalStorage(locationData) {
  const data = localStorage.getItem(DB_KEY);
  let current = [];
  if (data) {
    try {
      current = JSON.parse(data);
    } catch (e) {
      current = [];
    }
  }
  
  current.push(locationData);
  
  // Increase limit for offline scenarios (e.g., 2 hours of tracking at 5s intervals)
  if (current.length > 2000) {
    current = current.slice(current.length - 2000);
  }
  
  localStorage.setItem(DB_KEY, JSON.stringify(current));
}

export function clearStoredLocations() {
  localStorage.removeItem(DB_KEY);
}

/**
 * Mock function to simulate data synchronization to the backend
 * @returns {Promise<boolean>}
 */
export async function syncStoredDataToServer() {
  const data = localStorage.getItem(DB_KEY);
  if (!data || JSON.parse(data).length === 0) return true;

  console.log("📡 Syncing offline data to server...", JSON.parse(data).length, "points");
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return success
  return true;
}
