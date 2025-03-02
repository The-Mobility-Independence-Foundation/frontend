"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterType } from "../types/FilterTypes";

const Map = dynamic(() => import('./Map'), { 
    ssr: false,
    loading: () => <Skeleton className="w-[100%] h-[60%] mb-4 rounded-md" />
})

interface LocationRadiusProps {
    className: string,
    onValueChange: (field: string, newValue: any) => void
}

interface LocationData {
    lat: number;
    lon: number;
}

export default function LocationRadius({className, onValueChange}: LocationRadiusProps) {
    const [location, setLocation] = useState("");
    const [radius, setRadius] = useState(8045)
    const [latLong, setLatLong] = useState<LatLngExpression>([43.1566, -77.6088]); // TODO get user's account lat long?
    const [locationError, setLocationError] = useState("");
    const [radiusError, setRadiusError] = useState("");

    function updateLocation(newLocation: string) {
        setLocation(newLocation);
    }

    function updateRadius(newRadius: string) {
        if(newRadius == "") {
            setRadiusError("Please enter a radius");
            return;
        }

        try {
            const radiusMeters = parseFloat(newRadius) * 1609;

            if(radiusMeters <= 0) {
                setRadiusError("Please enter a positive value");
                return;
            }

            setRadius(radiusMeters);
            setRadiusError("");

            onValueChange(FilterType.Radius, radiusMeters);
        } catch (error) {
            setRadiusError("Please enter a numeric value");
        }
    }

    const clickGo = async () => {
        try {
            const data = await (await fetch(`https://geocode.maps.co/search?q=${location}&api_key=67b2372676166562084583mew922f0d`)).json();
            updateMap(data);
        } catch (err) {
            console.log((err as Error).message);
        }
    };

    const keyPressed = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            clickGo();
        }
    };

    function updateMap(response: LocationData[]) {
        if(response.length == 0) {
            setLocationError("Invalid location");
        }

        setLatLong([response[0].lat, response[0].lon]);
        setLocationError("");

        onValueChange(FilterType.LocationLat, response[0].lat);
        onValueChange(FilterType.LocationLong, response[0].lon);
    }

    return <div className={className}>
        <div className="flex">
            <Input placeholder="Location" onChange={(e) => updateLocation(e.target.value)} onKeyDown={keyPressed}
                className={locationError != "" ? "placeholder:text-red-400 text-red-600 border-red-200" : "mb-4"}></Input>
            <Button className="button" onClick={clickGo}>Go</Button>
        </div>
        <p className="text-red-600">{locationError}</p>
        <Map pos={latLong} radius={radius} className="w-[100%] h-[150px] md:h-[60%] mb-4 rounded-md"></Map>
        <Input placeholder="Radius (mi.)" type="number" min="0" onChange={(e) => updateRadius(e.target.value)}
            className={radiusError != "" ? "placeholder:text-red-400 text-red-600 border-red-200" : ""}></Input>
        <p className="text-red-600">{radiusError}</p>
    </div>
}