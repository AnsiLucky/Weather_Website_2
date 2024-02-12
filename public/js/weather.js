const map = L.map("map");

map.setView([data.current.Latitude, data.current.Longitude], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
attribution: "© OpenStreetMap contributors",
}).addTo(map);

L.marker([data.current.Latitude, data.current.Longitude]).addTo(map).bindPopup(data.current.City);  

document.querySelector(".sub-header").style.backgroundImage = 
`linear-gradient(rgba(4, 9, 3, 0.7), rgba(4, 9, 3, 0.7)), url('https://source.unsplash.com/1600x900/?${data.current.City}')`;


document.getElementById('cityForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const city = document.getElementById('cityInput').value.trim();
  const url = `/?city=${city}`;
  window.history.pushState({city: city}, '', url);
  window.location.href = url;
});