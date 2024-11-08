import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import markerImage from '../../assets/marker.png';

const styles = `
  .map-container {
    width: 100%;
    height: 400px;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
  }

  .coordinates-display {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 1;
    font-size: 14px;
  }
`;

const LocationPicker = ({ cityCoordinates, onLocationSelect }) => {
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Initialize map
  useEffect(() => {
    const initMap = L.map('map').setView([33.8869, 9.5375], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(initMap);

    mapRef.current = initMap;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Handle city coordinate changes - only pan to location
  useEffect(() => {
    if (!mapRef.current || !cityCoordinates) return;

    const { lat, lng } = cityCoordinates;
    mapRef.current.setView([lat, lng], 12, {
      animate: true,
      duration: 1
    });
  }, [cityCoordinates]); // Now properly tracking cityCoordinates changes

  // Handle map clicks for actual location selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e) => {
      const { lat, lng } = e.latlng;

      // Remove existing marker
      if (marker) {
        map.removeLayer(marker);
      }

      // Create icon
      const icon = L.icon({
        iconUrl: markerImage,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Add new marker
      const newMarker = L.marker([lat, lng], { icon }).addTo(map);

      setMarker(newMarker);
      setSelectedLocation({ lat, lng });
      
      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [marker, onLocationSelect]); // Added proper dependencies

  return (
    <div className="container mt-4">
      <style>{styles}</style>
      <div className="row">
        <div className="col-12">
          <p>Cliquez sur la carte pour sélectionner votre emplacement exact</p>
          <div className="map-container">
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
            {selectedLocation && (
              <div className="coordinates-display">
                <strong>Emplacement sélectionné:</strong><br />
                Lat: {selectedLocation.lat.toFixed(6)}<br />
                Lng: {selectedLocation.lng.toFixed(6)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;