import React, { useEffect, useRef } from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";

interface MapProps {
  pos: LatLngExpression;
  radius: number;
  className: string;
}

const Map = ({ pos, radius, className }: MapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const circleRef = useRef<L.Circle | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) {
            return;
        }

        const map = L.map(mapRef.current, {zoomControl: false}).setView(pos, 10);
        mapInstance.current = map;

        const maplibreLayer = L.maplibreGL({
            style: "https://tiles.openfreemap.org/styles/liberty",
        });
        
        map.addLayer(maplibreLayer);
        map.attributionControl.addAttribution(
            '<a href="https://openmaptiles.org/">&copy; OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        );

        const customIcon = L.icon({
            iconUrl: "/assets/map-marker.png",
            iconSize: [30, 39],
            iconAnchor: [14, 38]
        });

        const marker = L.marker(pos, { icon: customIcon, interactive: false }).addTo(map);
        markerRef.current = marker;

        const circle = L.circle(pos, {
            fillOpacity: 0.5,
            radius: radius,
            interactive: false
        }).addTo(map);
        circleRef.current = circle;

        const zoom = L.control.zoom({position: "topright"});
        zoom.addTo(map);

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    });

    useEffect(() => {
        if (!mapInstance.current) {
            return;
        }

        mapInstance.current.setView(pos);

        if (markerRef.current) {
            markerRef.current.setLatLng(pos);
        }

        if (circleRef.current) {
            // console.log(radius);
            circleRef.current.setLatLng(pos);
            circleRef.current.setRadius(radius);
        }
    }, [pos, radius]);

    return <div ref={mapRef} className={className} />;
};

export default Map;
