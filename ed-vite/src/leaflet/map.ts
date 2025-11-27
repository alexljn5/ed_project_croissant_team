import L from 'leaflet';

export function initMap(containerId: string) {
  const map: L.Map = L.map(containerId).setView([52.518611, 5.471389], 13);

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

  // Placeholder marker to verify it works
  const fotoHtml: string = '<img src="/src/assets/img/agorahof.webp" width="200" height="150" style="border-radius: 8px;"> <br> <strong>De Agora</strong>';
  L.marker([52.5205, 5.4790], { icon: defaultIcon })
    .addTo(map)
    .bindPopup(fotoHtml);

  return map;
}

