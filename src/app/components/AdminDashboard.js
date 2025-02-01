"use client"; // Add this line to mark the component as a client component

import React, { useState, useEffect } from 'react';
import LocationCard from './LocationCard';
import '../globals.css';

export default function AdminDashboard({ locations }) {
  const [filterType, setFilterType] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(locations);

  // Filter locations whenever `filterType` changes
  useEffect(() => {
    if (filterType === '') {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(locations.filter(location => location.wasteType.toLowerCase() === filterType.toLowerCase()));
    }
  }, [filterType, locations]);

  const handleUpdate = async (updatedLocation) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/${updatedLocation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLocation),
      });
      if (res.ok) {
        const updated = await res.json();
        setFilteredLocations(prev => prev.map(loc => (loc._id === updated._id ? updated : loc)));
      } else {
        console.error('Failed to update location');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFilteredLocations(prev => prev.filter(loc => loc._id !== id));
      } else {
        console.error('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

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
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <LocationCard
                key={location._id}
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
