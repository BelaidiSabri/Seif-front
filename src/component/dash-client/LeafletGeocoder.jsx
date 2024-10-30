import React, { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import 'leaflet-control-geocoder';
import "../../CSS/Accueil.css" // Make sure to import the geocoder here

const LeafletGeocoder = () => {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    });

    geocoder.on("markgeocode", function (e) {
      const latlng = e.geocode.center;
      L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();
      map.fitBounds(e.geocode.bbox);
    });

    geocoder.addTo(map);

    return () => {
      geocoder.remove(); // Cleanup the geocoder on component unmount
    };
  }, [map]); // Add map as a dependency

  return null;
};

export default LeafletGeocoder;
