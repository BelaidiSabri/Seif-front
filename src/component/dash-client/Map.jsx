import React, { useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const Map = () => {
  const position = [36.8065, 10.1815]; // Default position
  const [mapCenter, setMapCenter] = useState(position);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  const handleSearch = () => {
    // Call Nominatim API to search for the address
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setMapCenter([parseFloat(lat), parseFloat(lon)]); // Update map center
        } else {
          alert("Address not found.");
        }
      })
      .catch((err) => {
        console.error("Error searching address:", err);
      });
  };

  return (
    <div>
      <h3>GestionUser</h3>
      {/* Search Input */}
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Entrez l'adresse"
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            flex: 1,
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#00b4cc",
            color: "white",
            cursor: "pointer",
          }}
        >
          rechercher
        </button>
      </div>

      {/* Map Component */}
      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: "700px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeMapCenter position={mapCenter} />
      </MapContainer>
    </div>
  );
};

const ChangeMapCenter = ({ position }) => {
  const map = useMap();
  map.setView(position);
  return null;
};

export default Map;













//old map

/* import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import LeafletGeocoder from "./LeafletGeocoder";
const Map = () => {
  const position = [36.8065, 10.1815];

  return (
    <div>
      GestionUser
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LeafletGeocoder />
      </MapContainer>
    </div>
  );
};

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  iconSize: [25, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default Map; */


