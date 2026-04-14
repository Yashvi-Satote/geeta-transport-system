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
  let current = getStoredLocations();
  current.push(locationData);
  
  // Enforce Max Size for Performance
  if (current.length > 200) {
    current = current.slice(current.length - 200);
  }
  
  localStorage.setItem(DB_KEY, JSON.stringify(current));
}
