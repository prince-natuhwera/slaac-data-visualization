// SLAAC DATA VIEWER Frontend JS
// This file handles the map, search, and interaction logic for both Sheema and Ibanda tables

// --- Add a table selector to the DOM ---
(function ensureTableSelector() {
  if (!document.getElementById('table-selector')) {
    const searchBar = document.querySelector('.search-bar');
    const select = document.createElement('select');
    select.id = 'table-selector';
    select.innerHTML = `
      <option value="sheema">Sheema</option>
      <option value="ibanda">Ibanda</option>
    `;
    searchBar.insertBefore(select, searchBar.firstChild);
  }
})();

// Initialize the map
const map = L.map('map', {
  center: [-0.573, 30.389], // Center on Sheema district (Uganda)
  zoom: 11,
  minZoom: 8,
  maxZoom: 18
});

// Add base layers
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© Esri'
});

const baseMaps = {
  "OpenStreetMap": osm,
  "Satellite": satellite
};

L.control.layers(baseMaps).addTo(map);

// Layer for parcels
let parcelLayer = L.geoJSON(null, {
  style: {
    color: "#3949ab",
    weight: 2,
    fillColor: "#c5cae9",
    fillOpacity: 0.5
  },
  onEachFeature: function (feature, layer) {
    // When a parcel is clicked, show details in a Leaflet popup
    layer.on('click', function () {
      const props = feature.properties;
      const table = document.getElementById('table-selector').value;
      
      let popupContent = `<h3>Parcel Details</h3><table>`;
      
      if (table === 'sheema') {
        popupContent += `
          <tr><td><strong>Parcel ID:</strong></td><td>${props.pin || 'N/A'}</td></tr>
          <tr><td><strong>Owner Name:</strong></td><td>${props.name || 'N/A'}</td></tr>
          <tr><td><strong>District:</strong></td><td>${props.district || 'N/A'}</td></tr>
          <tr><td><strong>County:</strong></td><td>${props.county || 'N/A'}</td></tr>
          <tr><td><strong>Subcounty:</strong></td><td>${props.subcounty || 'N/A'}</td></tr>
          <tr><td><strong>Parish:</strong></td><td>${props.parish || 'N/A'}</td></tr>
          <tr><td><strong>Village:</strong></td><td>${props.village || 'N/A'}</td></tr>
          <tr><td><strong>Block:</strong></td><td>${props.block || 'N/A'}</td></tr>
          <tr><td><strong>Area (ha):</strong></td><td>${props.area_ha || 'N/A'}</td></tr>
          <tr><td><strong>Current Use:</strong></td><td>${props.cur_use || 'N/A'}</td></tr>
          <tr><td><strong>Intended Use:</strong></td><td>${props.int_use || 'N/A'}</td></tr>
          <tr><td><strong>Tenancy:</strong></td><td>${props.tenancy || 'N/A'}</td></tr>
          <tr><td><strong>Gender:</strong></td><td>${props.gender || 'N/A'}</td></tr>
          <tr><td><strong>DOB:</strong></td><td>${props.dob || 'N/A'}</td></tr>
          <tr><td><strong>Tel Number:</strong></td><td>${props.tel_number || 'N/A'}</td></tr>
        `;
      } else if (table === 'ibanda') {
        popupContent += `
          <tr><td><strong>Parcel ID:</strong></td><td>${props.parcel_id || props.pin || 'N/A'}</td></tr>
          <tr><td><strong>Owner Name:</strong></td><td>${props.full_names || 'N/A'}</td></tr>
          <tr><td><strong>District:</strong></td><td>${props.district || 'N/A'}</td></tr>
          <tr><td><strong>County:</strong></td><td>${props.county || 'N/A'}</td></tr>
          <tr><td><strong>Subcounty:</strong></td><td>${props.subcounty || 'N/A'}</td></tr>
          <tr><td><strong>Parish:</strong></td><td>${props.parish || 'N/A'}</td></tr>
          <tr><td><strong>Village:</strong></td><td>${props.village || 'N/A'}</td></tr>
          <tr><td><strong>Block:</strong></td><td>${props.block || 'N/A'}</td></tr>
          <tr><td><strong>Area (ha):</strong></td><td>${props.area_ha || 'N/A'}</td></tr>
          <tr><td><strong>Current Use:</strong></td><td>${props.cur_use || 'N/A'}</td></tr>
          <tr><td><strong>Intended Use:</strong></td><td>${props.int_use || 'N/A'}</td></tr>
          <tr><td><strong>Tenancy:</strong></td><td>${props.tenancy || 'N/A'}</td></tr>
          <tr><td><strong>Gender:</strong></td><td>${props.gender || 'N/A'}</td></tr>
          <tr><td><strong>DOB:</strong></td><td>${props.date_of_bi || 'N/A'}</td></tr>
          <tr><td><strong>Tel Number:</strong></td><td>${props.phone_numb || 'N/A'}</td></tr>
        `;
      } else {
        // Fallback for unknown table
        for (const key in props) {
          popupContent += `<tr><td><strong>${key}:</strong></td><td>${props[key]}</td></tr>`;
        }
      }
      
      popupContent += `</table>`;
      layer.bindPopup(popupContent).openPopup();
    });
  }
}).addTo(map);

// Handle search
document.getElementById('search-btn').addEventListener('click', searchParcel);
document.getElementById('search-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') searchParcel();
});

// Function to search for a parcel by ID or owner name, now with table selection
function searchParcel() {
  const query = document.getElementById('search-input').value.trim();
  const table = document.getElementById('table-selector').value;
  
  if (!query) {
    alert('Please enter a Parcel ID or Owner Name.');
    return;
  }
  
  if (!table) {
    alert('Please select a table/district.');
    return;
  }

  // Fetch from backend API with table parameter
  fetch(`/api/parcels/search?q=${encodeURIComponent(query)}&table=${encodeURIComponent(table)}`)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.features || data.features.length === 0) {
        alert('No parcel found for your search.');
        return;
      }
      // Clear previous layer
      parcelLayer.clearLayers();
      // Add new parcels
      parcelLayer.addData(data);

      // Zoom to the first parcel found
      const bounds = parcelLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { maxZoom: 17 });
      }

    })
    .catch(err => {
      console.error(err);
      alert('Error fetching parcel data.');
    });
}

