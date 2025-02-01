// components/LocationCard.js
import React, { useState } from 'react';

export default function LocationCard({ location, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedLocation, setUpdatedLocation] = useState(location);

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdate(updatedLocation);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      onDelete(location._id);
    }
  };

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg mb-4 transition transform hover:scale-105 hover:shadow-xl">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={updatedLocation.name}
            onChange={(e) => setUpdatedLocation({ ...updatedLocation, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <input
            type="text"
            value={updatedLocation.wasteType}
            onChange={(e) => setUpdatedLocation({ ...updatedLocation, wasteType: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <input
            type="text"
            value={updatedLocation.availability}
            onChange={(e) => setUpdatedLocation({ ...updatedLocation, availability: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-xl hover:bg-green-700"
          >
            Save
          </button>
        </form>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2 text-blue-600">{location.name}</h2>
            <div className="text-gray-700">
            <p className="mb-1"><span className="font-semibold">Waste Type:</span> {location.name}</p>
              <p className="mb-1"><span className="font-semibold">Waste Type:</span> {location.wasteType}</p>
              <p className="mb-1"><span className="font-semibold">Availability:</span> {location.availability}</p>
              <p className="mb-1"><span className="font-semibold">Latitude:</span> {location.location.coordinates[1]}</p>
              <p className="mb-1"><span className="font-semibold">Longitude:</span> {location.location.coordinates[0]}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
