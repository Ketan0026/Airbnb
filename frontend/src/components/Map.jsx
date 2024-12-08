import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";
import useCountries from "./Countries";

const ICON = icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131261/isolated/preview/b2e48580147ca0ed3f970f30bf8bb009-karten-standortmarkierung.png",
  iconSize: [50, 50],
});

function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.panTo(center, { animate: true });
    }
  }, [center, map]);

  return null;
}

export default function Map({ locationValue }) {
  const { getCountryByValue } = useCountries();
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([52.505, -0.09]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        if (!locationValue) {
          setMapCenter([latitude, longitude]);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, [locationValue]);

  useEffect(() => {
    if (locationValue) {
      const latLang = getCountryByValue(locationValue)?.latLang;
      if (latLang) {
        setMapCenter(latLang);
      }
    } else if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [locationValue, userLocation, getCountryByValue]);

  return (
    <MapContainer
      scrollWheelZoom={false}
      className="h-72 smd:h-[450px] rounded-lg relative -z-10"
      center={mapCenter}
      zoom={8}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater center={mapCenter} />

      <Marker position={mapCenter} icon={ICON} />
      
    </MapContainer>
  );
}
