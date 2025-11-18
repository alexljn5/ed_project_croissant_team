// ALLES HEEFT EEN TYPE → fouten = rood in VS Code = meteen gefixt
document.addEventListener("DOMContentLoaded", () => {
  // map is automatisch L.Map → geen gokken
  const map: L.Map = L.map("map").setView([52.518611, 5.471389], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // TypeScript dwingt juiste icon-opties af
  const purple: L.Icon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41] // als je dit vergeet → direct rood!
  });

  // Fout? TypeScript schreeuwt meteen:
  // "Argument of type 'string' is not assignable to parameter of type 'number'"
  L.marker([52.518, 5.471], { icon: purple })
    .addTo(map)
    .bindPopup("<b>PAARSE STER LEEFT!</b><br>En geen errors meer ooit")
    .openPopup();
});