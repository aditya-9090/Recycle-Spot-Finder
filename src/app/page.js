'use client';

import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import './globals.css';

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
  const [driverCoords, setDriverCoords] = useState({ lat: null, lng: null });
  const [locations, setLocations] = useState([]); // State to store fetched locations
  const defaultIconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"; // Default icon URL

  useEffect(() => {
    const map = L.map("map").setView([22.2587, 71.1924], 7); // Coordinates for Gujarat, India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Function to add a marker to the map with custom icon
    const addMarker = (coords, popupMessage, iconUrl) => {
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
        .addTo(map)
        .bindPopup(popupMessage)
        .openPopup();

      map.setView([coords.lat, coords.lng], 13);
    };

    // Function to get user's current location
    const findMyLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDriverCoords({ lat: latitude, lng: longitude });
            addMarker(
              { lat: latitude, lng: longitude },
              "Your Current Location",
              defaultIconUrl // Default icon URL for user's location
            );
          },
          (error) => {
            alert(`Error fetching location: ${error.message}`);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    };

    // Function for Find Spot button (add markers for all locations)
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
          defaultIconUrl // Default blue icon URL for other markers
        );
      });
    };

    document.getElementById('findMyLocation').addEventListener('click', findMyLocation);
    document.getElementById('findSpot').addEventListener('click', findSpot);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="w-full container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-6 text-center text-blue-800">
        Welcome to Recycle Spot Finder
      </h1>

      <div id="map" className="w-full h-[500px] rounded-lg shadow-md mb-6"></div>

      <div className="flex justify-center gap-4">
        <button
          id="findMyLocation"
          className="px-8 py-4 bg-green-600 text-white rounded-lg shadow-xl hover:bg-green-700 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Find My Location
        </button>

        <button
          id="findSpot"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-xl hover:bg-blue-700 transform transition duration-200 ease-in-out hover:scale-105"
        >
          Find Spot
        </button>
      </div>

      <div className="absolute bottom-4 right-8">
        <Link href="/admin">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-xl hover:bg-red-700 transform transition duration-200 ease-in-out hover:scale-105">
            Admin Panel
          </button>
        </Link>
      </div>
    </main>
  );
}
