const initialDealerships = [
  {
    id: 'FD1',
    name: 'Lamarque Ford',
    type: 'dealership',
    address: '3101 Williams Blvd, Kenner, LA 70065',
    city: 'Kenner',
    state: 'LA',
    country: 'US',
    lat: 30.0315,
    lng: -90.2398,
    currentBatteryCount: 96,
    maxCapacity: 160,
    fillRate: 6,
  },
  {
    id: 'FD2',
    name: 'Banner Ford',
    type: 'dealership',
    address: '1943 North Causeway Blvd, Mandeville, LA 70471',
    city: 'Mandeville',
    state: 'LA',
    country: 'US',
    lat: 30.3846,
    lng: -90.0913,
    currentBatteryCount: 124,
    maxCapacity: 180,
    fillRate: 7,
  },
  {
    id: 'FD3',
    name: 'Camelback Ford',
    type: 'dealership',
    address: '1330 E Camelback Rd, Phoenix, AZ 85014',
    city: 'Phoenix',
    state: 'AZ',
    country: 'US',
    lat: 33.5097,
    lng: -112.0527,
    currentBatteryCount: 138,
    maxCapacity: 220,
    fillRate: 9,
  },
  {
    id: 'FD4',
    name: 'AutoNation Ford Scottsdale',
    type: 'dealership',
    address: '8555 E Frank Lloyd Wright Blvd, Scottsdale, AZ 85260',
    city: 'Scottsdale',
    state: 'AZ',
    country: 'US',
    lat: 33.6304,
    lng: -111.8959,
    currentBatteryCount: 82,
    maxCapacity: 150,
    fillRate: 5,
  },
  {
    id: 'FD5',
    name: 'Lebanon Ford',
    type: 'dealership',
    address: '770 Columbus Ave, Lebanon, OH 45036',
    city: 'Lebanon',
    state: 'OH',
    country: 'US',
    lat: 39.4449,
    lng: -84.195,
    currentBatteryCount: 72,
    maxCapacity: 140,
    fillRate: 4,
  },
  {
    id: 'FD6',
    name: 'Dave Arbogast Ford',
    type: 'dealership',
    address: '3230 S County Rd 25A, Troy, OH 45373',
    city: 'Troy',
    state: 'OH',
    country: 'US',
    lat: 40.0076,
    lng: -84.2155,
    currentBatteryCount: 164,
    maxCapacity: 240,
    fillRate: 10,
  },
  {
    id: 'FD7',
    name: 'Angela Krause Ford',
    type: 'dealership',
    address: '1575 Mansell Rd, Alpharetta, GA 30009',
    city: 'Alpharetta',
    state: 'GA',
    country: 'US',
    lat: 34.0371,
    lng: -84.3312,
    currentBatteryCount: 118,
    maxCapacity: 200,
    fillRate: 7,
  },
  {
    id: 'FD8',
    name: 'Gwinnett Place Ford',
    type: 'dealership',
    address: '3230 Satellite Blvd, Duluth, GA 30096',
    city: 'Duluth',
    state: 'GA',
    country: 'US',
    lat: 33.9876,
    lng: -84.1378,
    currentBatteryCount: 154,
    maxCapacity: 230,
    fillRate: 8,
  },
  {
    id: 'FD9',
    name: 'Five Star Ford Stone Mountain',
    type: 'dealership',
    address: '3800 Highway 78 W, Snellville, GA 30039',
    city: 'Snellville',
    state: 'GA',
    country: 'US',
    lat: 33.8569,
    lng: -84.0205,
    currentBatteryCount: 84,
    maxCapacity: 150,
    fillRate: 5,
  },
  {
    id: 'FD10',
    name: 'Jim Ellis Ford Sandy Springs',
    type: 'dealership',
    address: '7555 Roswell Rd, Atlanta, GA 30350',
    city: 'Atlanta',
    state: 'GA',
    country: 'US',
    lat: 33.9748,
    lng: -84.3541,
    currentBatteryCount: 102,
    maxCapacity: 170,
    fillRate: 6,
  },
  {
    id: 'FD11',
    name: 'Mall of Georgia Ford',
    type: 'dealership',
    address: '4525 Nelson Brogdon Blvd NE, Buford, GA 30518',
    city: 'Buford',
    state: 'GA',
    country: 'US',
    lat: 34.1384,
    lng: -84.0306,
    currentBatteryCount: 91,
    maxCapacity: 160,
    fillRate: 6,
  },
  {
    id: 'FD12',
    name: 'Wade Ford',
    type: 'dealership',
    address: '3860 South Cobb Dr, Smyrna, GA 30080',
    city: 'Smyrna',
    state: 'GA',
    country: 'US',
    lat: 33.8584,
    lng: -84.5126,
    currentBatteryCount: 126,
    maxCapacity: 190,
    fillRate: 7,
  },
  {
    id: 'FD13',
    name: 'Towne Ford Sales',
    type: 'dealership',
    address: '1 A Bair Island Rd, Redwood City, CA 94063',
    city: 'Redwood City',
    state: 'CA',
    country: 'US',
    lat: 37.5029,
    lng: -122.215,
    currentBatteryCount: 62,
    maxCapacity: 140,
    fillRate: 3,
  },
  {
    id: 'FD14',
    name: 'Serramonte Ford',
    type: 'dealership',
    address: '999 Serramonte Blvd, Colma, CA 94014',
    city: 'Colma',
    state: 'CA',
    country: 'US',
    lat: 37.6695,
    lng: -122.4691,
    currentBatteryCount: 148,
    maxCapacity: 220,
    fillRate: 9,
  },
];

const recyclingCenters = [
  { id: 'RC1', name: 'Cox Recycling Center Atlanta', type: 'recycling', address: '123 Recycling Way, Atlanta, GA', city: 'Atlanta', state: 'GA', country: 'US', lat: 33.7488, lng: -84.3877 },
  { id: 'RC2', name: 'Cox Recycling Center Dallas', type: 'recycling', address: '456 Green Blvd, Dallas, TX', city: 'Dallas', state: 'TX', country: 'US', lat: 32.7767, lng: -96.7970 },
];

const zeroWasteLocations = [
  { id: 'ZW1', name: 'Cox Communications (Harahan)', type: 'zero-waste', address: '338 Edwards Ave, New Orleans, LA 70123', city: 'New Orleans', state: 'LA', country: 'US', lat: 29.9634, lng: -90.1878 },
  { id: 'ZW2', name: 'Cox Communications (Phoenix)', type: 'zero-waste', address: '102 W Watkins Rd, Phoenix, AZ 85003', city: 'Phoenix', state: 'AZ', country: 'US', lat: 33.4285, lng: -112.0754 },
  { id: 'ZW3', name: 'Cox Media Group Print Technology Center', type: 'zero-waste', address: '5000 Commerce Center Dr, Franklin, OH', city: 'Franklin', state: 'OH', country: 'US', lat: 39.5701, lng: -84.3168 },
  { id: 'ZW4', name: 'The Atlanta Journal-Constitution N. Fulton Distribution Center', type: 'zero-waste', address: '11425 Maxwell Road, Alpharetta, GA 30009', city: 'Alpharetta', state: 'GA', country: 'US', lat: 34.0673, lng: -84.3051 },
  { id: 'ZW5', name: 'The Atlanta Journal-Constitution Stone Mountain Distribution Center', type: 'zero-waste', address: '1640 Stone Ridge Drive, Stone Mountain, GA 30083', city: 'Stone Mountain', state: 'GA', country: 'US', lat: 33.8247, lng: -84.1528 },
  { id: 'ZW6', name: 'The Atlanta Journal-Constitution Printing Facility', type: 'zero-waste', address: '6455 Best Friend Rd, Norcross, GA 30071', city: 'Norcross', state: 'GA', country: 'US', lat: 33.9431, lng: -84.2057 },
  { id: 'ZW7', name: "Xtime's Headquarters", type: 'zero-waste', address: '1400 Bridge Pkwy Suite 200, Redwood City, CA 94065', city: 'Redwood City', state: 'CA', country: 'US', lat: 37.5345, lng: -122.2479 },
];

let allLocations = [...initialDealerships, ...recyclingCenters, ...zeroWasteLocations];
let totalBatteriesRecycled = 0;
let subscribers = [];
const UPDATE_INTERVAL_MS = 60000;
let nextUpdateAt = Date.now() + UPDATE_INTERVAL_MS;
let batteryHistory = [];
let simulatedDay = 0;

function getTotalBatteriesInField() {
  return allLocations
    .filter((d) => d.type === 'dealership')
    .reduce((sum, d) => sum + (d.currentBatteryCount || 0), 0);
}

function recordSnapshot() {
  batteryHistory.push({ day: simulatedDay, total: getTotalBatteriesInField() });
  const maxDays = 15;
  batteryHistory = batteryHistory.filter((h) => simulatedDay - h.day <= maxDays);
}

recordSnapshot();

const NOTIFICATION_WARNING_THRESHOLD = 0.85; // 85% capacity
const NOTIFICATION_ERROR_THRESHOLD = 0.9; // 90% capacity

function notifySubscribers() {
  subscribers.forEach(callback => callback());
}

export function subscribeToMockData(callback) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
}

export function getMockLocations() {
  return allLocations;
}

export function getTotalBatteriesRecycled() {
  return totalBatteriesRecycled;
}

export function getNextUpdateAt() {
  return nextUpdateAt;
}

export function getBatteryHistory() {
  return batteryHistory;
}

export function getSimulatedDay() {
  return simulatedDay;
}

export function simulatePickup(dealershipId) {
  const dealership = allLocations.find(loc => loc.id === dealershipId && loc.type === 'dealership');
  if (dealership) {
    totalBatteriesRecycled += dealership.currentBatteryCount;
    dealership.currentBatteryCount = 0; // Reset after pickup
    console.log(`Simulated pickup at ${dealership.name}. Batteries recycled: ${totalBatteriesRecycled}`);
    recordSnapshot();
    notifySubscribers();
  }
}

// Simulate battery fill rate and potential notifications
setInterval(() => {
  let changed = false;
  allLocations = allLocations.map(location => {
    if (location.type === 'dealership') {
      const newBatteryCount = location.currentBatteryCount + location.fillRate;
      if (newBatteryCount <= location.maxCapacity) {
        location.currentBatteryCount = newBatteryCount;
        changed = true;
      } else {
        location.currentBatteryCount = location.maxCapacity;
      }

      // Check for notification threshold (warning/error)
      const pct = location.maxCapacity ? (location.currentBatteryCount / location.maxCapacity) : 0;
      let nextLevel = null;
      if (pct >= NOTIFICATION_ERROR_THRESHOLD) nextLevel = 'error';
      else if (pct >= NOTIFICATION_WARNING_THRESHOLD) nextLevel = 'warning';

      if (location.pickupNotificationLevel !== nextLevel) {
        location.pickupNotificationLevel = nextLevel;
        if (nextLevel) {
          console.log(`NOTIFICATION (${nextLevel}): ${location.name} is at ${(pct * 100).toFixed(0)}% capacity!`);
        }
        changed = true;
      }
    }
    return location;
  });

  if (changed) {
    simulatedDay += 1;
    recordSnapshot();
    notifySubscribers();
  }
  nextUpdateAt = Date.now() + UPDATE_INTERVAL_MS;
}, UPDATE_INTERVAL_MS); // Update every 60 seconds

// Simulate a pickup for a full dealership every 30 seconds
setInterval(() => {
  const fullDealership = allLocations.find(loc => 
    loc.type === 'dealership' && 
    loc.currentBatteryCount >= loc.maxCapacity * NOTIFICATION_ERROR_THRESHOLD &&
    loc.pickupNotificationLevel // Ensure it's one that triggered a notification
  );
  if (fullDealership) {
    simulatePickup(fullDealership.id);
  }
}, 30000); // Attempt pickup every 30 seconds
