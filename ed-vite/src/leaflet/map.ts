// src/leaflet/map.ts
import L from 'leaflet';

// Global state (zoals jij al had)
let currentRoutePolyline: L.Polyline | null = null;
let currentWaypointCircles: L.CircleMarker[] = [];
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

export function initMap(containerId: string): L.Map {
  const map: L.Map = L.map(containerId).setView([52.518611, 5.471389], 13);
  currentMap = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // ==== NIEUW: Live cursor coördinaten ====
  const coordsDiv = L.DomUtil.create('div', 'cursor-coords');
  coordsDiv.style.cssText = `
    position: absolute;
    bottom: 10px; left: 10px;
    background: rgba(0,0,0,0.75);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    z-index: 1000;
    pointer-events: none;
    user-select: none;
  `;
  coordsDiv.innerHTML = 'Lat: — | Lng: —';
  map.getContainer().appendChild(coordsDiv);

  map.on('mousemove', (e: L.LeafletMouseEvent) => {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    coordsDiv.innerHTML = `Lat: ${lat} | Lng: ${lng}`;
  });

  map.on('mouseout', () => {
    coordsDiv.innerHTML = 'Lat: — | Lng: —';
  });
  // ==== EINDE NIEUW ====

  (window as any).leafletMap = map;

  return map;
}

// De rest van je functies blijven 100% hetzelfde
export function drawRoute(map: L.Map, coordinates: Array<{ lat: number; lng: number }>) {
  if (!coordinates || coordinates.length < 2) {
    console.warn('Not enough coordinates for route');
    return;
  }

  if (currentRoutePolyline) {
    currentRoutePolyline.remove();
  }
  
  currentWaypointCircles.forEach(circle => circle.remove());
  currentWaypointCircles = [];

  const latLngs = coordinates.map(c => [c.lat, c.lng] as [number, number]);

  currentRoutePolyline = L.polyline(latLngs, {
    color: '#6b3b61',
    weight: 4,
    opacity: 0.8,
    dashArray: '5, 5'
  }).addTo(map);

  console.log(`Route drawn with ${coordinates.length} waypoints (line only)!`);
}

export function updateRoute(coordinates: Array<{ lat: number; lng: number }>) {
  if (currentMap) {
    drawRoute(currentMap, coordinates);
  }
}

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