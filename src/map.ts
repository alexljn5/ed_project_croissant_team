document.addEventListener("DOMContentLoaded", () => {
  const map: L.Map = L.map("map").setView([52.518611, 5.471389], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const purple = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  L.marker([52.518, 5.471], { icon: purple })
    .addTo(map)
    .bindPopup("PAARSE STER LEEFT!")
    .openPopup();
});
