// src/leaflet/map.ts
import L from 'leaflet';
const markerImg = new URL("../../assets/img/markers/marker.png", import.meta.url).href

// Global state (zoals jij al had)
let currentRoutePolyline: L.Polyline | null = null;
let currentWaypointCircles: L.CircleMarker[] = [];
let currentMap: L.Map | null = null;
const poiMarkers = new Map<string, L.Marker>();

export interface POI {
  id: string
  lat: number
  lng: number
  imageUrl?: string          // ← optional
  shortDescription: string
  longDescription?: string   // ← THIS MUST BE OPTIONAL
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
  // ALWAYS use your purple marker — never poi.imageUrl as icon!
  const purpleIcon = L.icon({
    iconUrl: markerImg, // ← THIS IS YOUR HERO
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
    shadowSize: [41, 41],
  })

  const marker = L.marker([poi.lat, poi.lng], { icon: purpleIcon })
    .addTo(map)

  // Image goes ONLY in the popup — never as the marker icon
  const popupImage = poi.imageUrl && poi.imageUrl.trim() !== ''
    ? `<img src="${poi.imageUrl}" width="200" style="border-radius:8px; margin-bottom:8px; max-height:150px; object-fit:cover;">`
    : `<div style="width:200px; height:120px; background:#f0f0f0; border-radius:8px; margin-bottom:8px; display:flex; align-items:center; justify-content:center; color:#aaa; font-size:13px;">Geen foto</div>`

  marker.bindPopup(`
    <div style="text-align:center; font-family:sans-serif;">
      ${popupImage}
      <strong style="font-size:15px; display:block; margin:8px 0;">${poi.shortDescription}</strong>
      <p style="margin:6px 0; font-size:13px; color:#555; max-width:220px;">${poi.longDescription || ''}</p>
      <button class="poi-more-btn" data-id="${poi.id}"
              style="margin-top:8px; padding:6px 12px; background:#6b3f7b; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">
        Meer info →
      </button>
    </div>
  `, {
    maxWidth: 280
  })

  poiMarkers.set(poi.id, marker)
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