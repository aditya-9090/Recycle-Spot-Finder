// app/admin/page.js
"use client";

import React, { useState, useEffect } from 'react';
import LocationCard from '../components/LocationCard';
import '../globals.css';

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

async function updateLocation(updatedLocation) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/${updatedLocation._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedLocation)
    });
    if (!res.ok) {
      throw new Error('Failed to update location');
    }
    return await res.json();
  } catch (error) {
    console.error('Error updating location:', error);
  }
}

async function deleteLocation(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Failed to delete location');
    }
    return await res.json();
  } catch (error) {
    console.error('Error deleting location:', error);
  }
}

export default function AdminDashboard() {
  const [locations, setLocations] = useState([]);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    async function loadLocations() {
      const fetchedLocations = await fetchLocations();
      setLocations(fetchedLocations);
    }

    loadLocations();
  }, []);

  const handleUpdate = async (updatedLocation) => {
    const updated = await updateLocation(updatedLocation);
    if (updated) {
      setLocations(locations.map(loc => loc._id === updated._id ? updated : loc));
    } else {
      console.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    await deleteLocation(id);
    setLocations(locations.filter(loc => loc._id !== id));
  };

  // Filter locations by waste type
  const filteredLocations = filterType
    ? locations.filter(location => location.wasteType.toLowerCase() === filterType.toLowerCase())
    : locations;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Admin Dashboard</h1>
        <p className="text-lg font-semibold mb-4 text-center">Total Locations: {filteredLocations.length}</p>
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setFilterType('')}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow-md hover:bg-gray-400 transition"
          >
            All
          </button>
          <button
            onClick={() => setFilterType('plastic')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Plastic
          </button>
          <button
            onClick={() => setFilterType('paper')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Paper
          </button>
          <button
            onClick={() => setFilterType('wet')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition"
          >
            Wet
          </button>
          <button
            onClick={() => setFilterType('dry')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Dry
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(filteredLocations) && filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <LocationCard
                key={index}
                location={location}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-center col-span-full">No locations available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
