import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LocationSearcher = ({ 
  onLocationSelect, 
  products = [], 
  maxDistance = 50,
  showProductMarkers = true
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [productMarkers, setProductMarkers] = useState([]);
  const [searchCircle, setSearchCircle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!map && document.getElementById('map')) {
      L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';
      
      const newMap = L.map('map').setView([33.8869, 9.5375], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(newMap);

      setMap(newMap);
      mapRef.current = newMap;

      // Automatically get the user's location on load
      getCurrentLocation();

      return () => {
        newMap.remove();
      };
    }
  }, []);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          updateLocation({ lat, lng });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const updateLocation = (location) => {
    if (!map) return;
    
    const { lat, lng } = location;

    if (userMarker) {
      userMarker.remove();
    }
    if (searchCircle) {
      searchCircle.remove();
    }
    productMarkers.forEach(marker => marker.remove());

    const icon = new L.Icon.Default();
    const newMarker = L.marker([lat, lng], { icon }).addTo(map);
    const circle = L.circle([lat, lng], {
      radius: maxDistance * 1000,
      fillColor: '#007bff',
      fillOpacity: 0.1,
      color: '#007bff',
      opacity: 0.3
    }).addTo(map);

    setUserMarker(newMarker);
    setSearchCircle(circle);
    setSelectedLocation({ lat, lng });
    
    if (onLocationSelect) {
      onLocationSelect({ lat, lng });
    }

    map.fitBounds(circle.getBounds());
  };

  // Update product markers based on proximity
  useEffect(() => {
    if (!map || !showProductMarkers || !selectedLocation) return;

    productMarkers.forEach(marker => marker.remove());
    
    const redIcon = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41],
      className: 'red-marker' // We'll style this with CSS to make it red
    });

    const newMarkers = products.map(product => {
      if (!product.coordinates || product.coordinates.length !== 2) return null;

      const productLat = product.coordinates[1];
      const productLng = product.coordinates[0];
      const distance = map.distance([selectedLocation.lat, selectedLocation.lng], [productLat, productLng]) / 1000;
      
      if (distance > maxDistance) return null;

      const marker = L.marker(
        [productLat, productLng],
        { icon: redIcon }
      ).addTo(map);

      marker.bindPopup(`
        <strong>${product.title || 'Produit'}</strong><br>
        ${product.price ? `Prix: ${product.price}DT` : 'Gratuit'}<br>
        Distance: ${distance.toFixed(1)} km
      `);

      return marker;
    }).filter(Boolean);

    setProductMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [products, showProductMarkers, selectedLocation, map, maxDistance]);

  return (
    <div className="relative w-full">
      <div className="w-full h-64 rounded-lg overflow-hidden mb-4"> {/* Changed height from h-96 to h-64 */}
        <div id="map" className="w-full h-full" />
        <button 
          className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md disabled:opacity-50"
          onClick={getCurrentLocation}
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : 'Ma Position'}
        </button>
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm">
            <strong>Rayon de recherche:</strong> {maxDistance} km<br />
            <strong>Emplacement:</strong><br />
            Lat: {selectedLocation.lat.toFixed(6)}<br />
            Lng: {selectedLocation.lng.toFixed(6)}
          </div>
        )}
      </div>
      <style>{`
        .red-marker {
          filter: hue-rotate(140deg) saturate(120%);
        }
      `}</style>
    </div>
  );
};

export default LocationSearcher;