import { useState } from "react";

export default function AddLocationForm({ coordinates }) {
  const [name, setName] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [availability, setAvailability] = useState("");
  const [coords, setCoords] = useState(coordinates); // Initialize coords with passed props

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`, {
      method: "POST",
      body: JSON.stringify({
        name,
        wasteType,
        availability,
        latitude: coords.lat,
        longitude: coords.lng,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Location added successfully");
    } else {
      const errorData = await res.json();
      console.error("Error adding location:", errorData);
      alert(`Error adding location: ${errorData.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-6 bg-white rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Spot</h2>

      <input
        type="text"
        placeholder="Location Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
      />
      <input
        type="text"
        placeholder="Waste Type"
        value={wasteType}
        onChange={(e) => setWasteType(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
      />
      <input
        type="text"
        placeholder="Availability"
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
      />
      <input
        type="text"
        placeholder="Latitude"
        value={coords.lat}
        disabled
        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
      />
      <input
        type="text"
        placeholder="Longitude"
        value={coords.lng}
        disabled
        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-xl hover:bg-green-700"
      >
        Add Location
      </button>
    </form>
  );
}
