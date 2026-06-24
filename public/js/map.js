const defaultLat = 28.6139;
const defaultLng = 77.2090;

const map = L.map('map').setView([defaultLat, defaultLng], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Create custom Airbnb-style Leaflet DivIcon
const airbnbIcon = L.divIcon({
      html: '<i class="fa-solid fa-house"></i>',
      className: 'airbnb-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
});

// Format Price
const formattedPrice = listingPrice ? `₹ ${listingPrice.toLocaleString("en-IN")}` : "Price on request";

// Create custom Airbnb-style popup HTML
const popupContent = `
      <div class="airbnb-popup-card">
            <img src="${listingImage}" class="airbnb-popup-img" alt="${listingTitle}">
            <div class="airbnb-popup-info">
                  <h4 class="airbnb-popup-title">${listingTitle}</h4>
                  <p class="airbnb-popup-location">${listingLocation}, ${listingCountry}</p>
                  <p class="airbnb-popup-price"><strong>${formattedPrice}</strong> / night</p>
            </div>
      </div>
`;

// Build query for Nominatim geocoding
const addressQuery = `${listingLocation}, ${listingCountry}`;

fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}`)
      .then(response => response.json())
      .then(data => {
            if (data && data.length > 0) {
                  const lat = parseFloat(data[0].lat);
                  const lon = parseFloat(data[0].lon);
                  map.setView([lat, lon], 12);
                  L.marker([lat, lon], { icon: airbnbIcon }).addTo(map)
                        .bindPopup(popupContent)
                        .openPopup();
            } else {
                  // If combined query fails, try geocoding just the location
                  return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listingLocation)}`);
            }
      })
      .then(response => {
            if (response) return response.json();
      })
      .then(data => {
            if (data && data.length > 0) {
                  const lat = parseFloat(data[0].lat);
                  const lon = parseFloat(data[0].lon);
                  map.setView([lat, lon], 12);
                  L.marker([lat, lon], { icon: airbnbIcon }).addTo(map)
                        .bindPopup(popupContent)
                        .openPopup();
            } else if (data) {
                  // Fallback marker
                  L.marker([defaultLat, defaultLng], { icon: airbnbIcon }).addTo(map)
                        .bindPopup(`<h5>Location not found</h5><p>Showing default: New Delhi</p>`)
                        .openPopup();
            }
      })
      .catch(error => {
            console.error('Error fetching map coordinates:', error);
            // Fallback marker
            L.marker([defaultLat, defaultLng], { icon: airbnbIcon }).addTo(map)
                  .bindPopup(`<h5>Error loading map</h5><p>Showing default: New Delhi</p>`)
                  .openPopup();
      });