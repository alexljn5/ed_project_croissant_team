import L from 'leaflet';

export function initMap(containerId: string) {
  const map: L.Map = L.map(containerId).setView([52.518611, 5.471389], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const purple: L.Icon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Your existing markers
  L.marker([44.518, 5.471], { icon: purple })
    .addTo(map)
    .bindPopup("<b>PAARSE STER LEEFT!</b><br>En geen errors meer ooit")
    .openPopup();

  L.marker([53.518, 6.471], { icon: purple })
    .addTo(map)
    .bindPopup("<b>NATE HIGGER WAS HERE!</b><br>En geen errors meer ooit")
    .openPopup();

  const fotoHtml: string = '<img src="src/img/agora.webp" width="200" height="150"> <br> De Agora';
  L.marker([52.5205, 5.4790], { icon: purple })
    .addTo(map)
    .bindPopup(fotoHtml);

  return map;
}