const map = L.map('map').setView([28.6139, 77.2090], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([28.6139, 77.2090]).addTo(map)
      .bindPopup("New Delhi")
      .openPopup();