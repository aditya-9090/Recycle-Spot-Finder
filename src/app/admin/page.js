'use client';
import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import '../globals.css';
import AddLocationForm from "../components/AddLocationForm"; 
async function fetchLocations() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`, {
      cache: 'no-store', // Ensure the data is not cached
    });
    const locations = await res.json();
    console.log('Fetched locations:', locations); // Log fetched data
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export default function HomePage() {
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility
  const [clickedCoords, setClickedCoords] = useState({ lat: null, lng: null }); // State for storing clicked coordinates
  const [locations, setLocations] = useState([]); // State to store fetched locations

  const mapRef = useRef(null); // Using useRef to keep the map instance reference
  const markerInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([22.2587, 71.1924], 7); // Gujarat coordinates

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Cleanup the map when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log('Updated clickedCoords:', clickedCoords);  // Log the updated clickedCoords
  }, [clickedCoords]);  // Run this effect when clickedCoords changes
  
  const addMarker = (coords, popupMessage, iconUrl) => {
    if (mapRef.current) {
      L.marker([coords.lat, coords.lng], {
        icon: L.icon({
          iconUrl: iconUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup(popupMessage)
        .openPopup();

      mapRef.current.setView([coords.lat, coords.lng], 13); // Set map view to marker's location
    }
  };

  const enableAddSpot = () => {
    if (mapRef.current) {
      mapRef.current.on('click', handleMapClick); // Add click listener to map
    }
  };
  
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setClickedCoords({ lat, lng }); // Set clicked coordinates
    console.log(clickedCoords)
    setIsFormVisible(true); // Show the form
    addMarker({ lat, lng }, "New Spot Added", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png");
  };

  const disableAddSpot = () => {
    if (mapRef.current) {
      mapRef.current.off('click', handleMapClick); // Remove click listener from map
    }
  };

  const findSpot = async () => {
    const fetchedLocations = await fetchLocations();
    setLocations(fetchedLocations);
    fetchedLocations.forEach(location => {
      const { name, wasteType, availability, location: loc } = location;
      const coords = { lat: loc.coordinates[1], lng: loc.coordinates[0] };
      const popupMessage = `<strong>${name}</strong><br>Waste Type: ${wasteType}<br>Availability: ${availability}`;
      addMarker(
        coords,
        popupMessage,
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" // Default blue icon URL for other markers
      );
    });
  };

  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          addMarker(
            { lat: latitude, lng: longitude },
            "Your Current Location",
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" // Default blue icon URL for user's location
          );
        },
        (error) => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <main className="w-full container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center text-blue-800">
        Welcome to Recycle Spot Finder
      </h1>

      <div id="map" className="w-full h-[400px] sm:h-[600px] rounded-lg shadow-md mb-6"></div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {/* Add Spot Button */}
        <button
          onClick={enableAddSpot}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-yellow-600 text-white rounded-lg shadow-xl hover:bg-yellow-700 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Add Spot
        </button>

        {/* Disable Add Spot Button */}
        <button
          onClick={disableAddSpot}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-red-600 text-white rounded-lg shadow-xl hover:bg-red-700 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Disable Add Spot
        </button>

        {/* Find Spot Button */}
        <button
          onClick={findSpot} // Fetch and show all spots
          className="px-6 py-3 sm:px-8 sm:py-4 bg-green-600 text-white rounded-lg shadow-xl hover:bg-green-700 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Find Spot
        </button>

        {/* Find My Location Button */}
        <button
          onClick={findMyLocation}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-lg shadow-xl hover:bg-blue-700 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Find My Location
        </button>

        {/* Driver Side Button */}
        <Link href="/">
          <button className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-800 text-white rounded-lg shadow-xl hover:bg-blue-900 transform transition duration-200 ease-in-out hover:scale-105">
            Driver Side
          </button>
        </Link>

        {/* Dashboard Button */}
        <Link href="/adminDashboard">
          <button className="px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 text-white rounded-lg shadow-xl hover:bg-indigo-700 transform transition duration-200 ease-in-out hover:scale-105">
            Dashboard
          </button>
        </Link>
      </div>

      {/* Show the AddLocationForm only if isFormVisible is true */}
      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <AddLocationForm coordinates={clickedCoords} />
        </div>
      )}
    </main>
  );
}
