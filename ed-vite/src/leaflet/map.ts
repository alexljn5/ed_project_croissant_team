import L from 'leaflet';

// Global route polyline that we can update
let currentRoute: L.Polyline | null = null;
let currentMap: L.Map | null = null;

export function initMap(containerId: string) {
  const map: L.Map = L.map(containerId).setView([52.518611, 5.471389], 13);
  currentMap = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Use the default Leaflet marker icon
  const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Marker 1
  const fotoHtml: string = '<img src="/src/assets/img/agorahof.webp" width="200" height="150" style="border-radius: 8px;"> <br> <strong>De Agora</strong>';
  L.marker([52.5205, 5.4790], { icon: defaultIcon })
    .addTo(map)
    .bindPopup(fotoHtml);

  // Store map on window so we can access it elsewhere
  (window as any).leafletMap = map;

  return map;
}

// Load and display route from coordinates array
export function drawRoute(map: L.Map, coordinates: Array<{ lat: number; lng: number }>) {
  if (!coordinates || coordinates.length < 2) {
    console.warn('Not enough coordinates for route');
    return;
  }

  // Remove old route
  if (currentRoute) {
    currentRoute.remove();
  }

  // Convert to [lat, lng] format
  const latLngs = coordinates.map(c => [c.lat, c.lng] as [number, number]);

  // Draw new route
  currentRoute = L.polyline(latLngs, {
    color: '#6b3b61',      // Purple
    weight: 4,
    opacity: 0.8,
    dashArray: '5, 5'
  }).addTo(map);

  // Add markers at each point
  coordinates.forEach((coord, idx) => {
    L.circleMarker([coord.lat, coord.lng], {
      radius: 5,
      color: '#6b3b61',
      fillColor: '#ff9800',
      fillOpacity: 0.8,
      weight: 2
    }).addTo(map).bindPopup(`Point ${idx + 1}`);
  });

  console.log(`✅ Route drawn with ${coordinates.length} points!`);
}

// Update entire route
export function updateRoute(coordinates: Array<{ lat: number; lng: number }>) {
  if (currentMap) {
    drawRoute(currentMap, coordinates);
  }
}



