import React, { useEffect, useRef } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";

interface MapProps {
  pos: LatLngExpression,
  radius: number
}

const Map = ({pos, radius}: MapProps) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView(pos, 13);
    
    const maplibreLayer = (L as any).maplibreGL({
      style: "https://tiles.openfreemap.org/styles/liberty",
      attribution: '&copy; <a href="https://openfreemap.org/">OpenFreeMap</a> <a href="https://openmaptiles.org/">© OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    map.addLayer(maplibreLayer);

    const customIcon = L.icon({
      iconUrl: "/assets/map-marker.png",
      iconSize: [30, 39],
      iconAnchor: [14, 38]
    });

    L.marker(pos, { icon: customIcon }).addTo(map);
    
    L.circle(pos, {
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default Map;
