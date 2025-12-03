import L from 'leaflet';

// Global state for waypoints (route line only, no popups/images)
let currentRoutePolyline: L.Polyline | null = null;
let currentWaypointCircles: L.CircleMarker[] = [];

// Global state for POI markers (with images and popups)
let currentMap: L.Map | null = null;
const poiMarkers = new Map<string, L.Marker>();

export interface POI {
  id: string
  lat: number
  lng: number
  imageUrl: string
  shortDescription: string
  longDescription: string
}

export function initMap(containerId: string) {
  const map: L.Map = L.map(containerId).setView([52.518611, 5.471389], 13);
  currentMap = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Store map on window so we can access it elsewhere
  (window as any).leafletMap = map;

  return map;
}

// ===== WAYPOINT FUNCTIONS (Route lines only) =====
export function drawRoute(map: L.Map, coordinates: Array<{ lat: number; lng: number }>) {
  if (!coordinates || coordinates.length < 2) {
    console.warn('Not enough coordinates for route');
    return;
  }

  // Remove old route polyline
  if (currentRoutePolyline) {
    currentRoutePolyline.remove();
  }
  
  // Clear old waypoint circles (we're not using them anymore)
  currentWaypointCircles.forEach(circle => circle.remove());
  currentWaypointCircles = [];

  // Convert to [lat, lng] format
  const latLngs = coordinates.map(c => [c.lat, c.lng] as [number, number]);

  // Draw ONLY the line - NO markers, NO images, NO popups
  currentRoutePolyline = L.polyline(latLngs, {
    color: '#6b3b61',      // Purple
    weight: 4,
    opacity: 0.8,
    dashArray: '5, 5'
  }).addTo(map);

  console.log(`✅ Route drawn with ${coordinates.length} waypoints (line only)!`);
}

export function updateRoute(coordinates: Array<{ lat: number; lng: number }>) {
  if (currentMap) {
    drawRoute(currentMap, coordinates);
  }
}

// ===== POI MARKER FUNCTIONS (Images and popups only) =====
export function addMarker(map: L.Map, poi: POI) {
  const customIcon = L.icon({
    iconUrl: poi.imageUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  const marker = L.marker([poi.lat, poi.lng], { icon: customIcon })
    .addTo(map)
    .bindPopup(`
      <div class="poi-popup-small">
        <img src="${poi.imageUrl}" width="80" height="80" style="border-radius: 8px; object-fit: cover; margin-bottom: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 14px;">${poi.shortDescription}</p>
        <button class="poi-more-btn" data-id="${poi.id}" style="padding: 4px 12px; background: #6b3f7b; color: white; border: none; border-radius: 4px; cursor: pointer;">Meer info</button>
      </div>
    `, {
      maxWidth: 250,
      className: 'poi-popup'
    });

  poiMarkers.set(poi.id, marker);
}

export function removeMarker(poi: POI) {
  const marker = poiMarkers.get(poi.id);
  if (marker) {
    marker.remove();
    poiMarkers.delete(poi.id);
  }
}

export function clearAllMarkers() {
  poiMarkers.forEach(marker => marker.remove());
  poiMarkers.clear();
}

export function getMarker(poiId: string): L.Marker | undefined {
  return poiMarkers.get(poiId);
}
