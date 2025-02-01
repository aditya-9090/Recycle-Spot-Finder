// src/app/api/locations/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import Location from '@/app/models/Location';

// PUT: Update an existing location
export async function PUT(req, { params }) {
  const { id } = params;  // Get the location ID from params
  const { name, wasteType, availability } = await req.json();

  // Validate required fields
  if (!name || !wasteType || !availability || !id) {
    return NextResponse.json({ message: 'Missing required fields or location ID' }, { status: 400 });
  }

  try {
    await dbConnect();  // Connect to the database

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      {
        name,
        wasteType,
        availability,
        
      },
      { new: true }  // To return the updated document
    ).lean();

    if (!updatedLocation) {
      return NextResponse.json({ message: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(updatedLocation, { status: 200 });  // Return the updated location
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ message: 'Error updating location', error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a location
export async function DELETE(req, { params }) {
  const { id } = params;  // Get the location ID from params

  if (!id) {
    return NextResponse.json({ message: 'Location ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();  // Connect to the database

    const deletedLocation = await Location.findByIdAndDelete(id).lean();  // Delete the location by ID

    if (!deletedLocation) {
      return NextResponse.json({ message: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Location deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ message: 'Error deleting location', error: error.message }, { status: 500 });
  }
}



// GET: Find a location by ID
export async function GET(req, { params }) {
    const { id } = params;  // Get the location ID from params
  
    try {
      await dbConnect();  // Connect to the database
  
      const location = await Location.findById(id).lean();  // Find the location by ID
  
      if (!location) {
        return NextResponse.json({ message: 'Location not found' }, { status: 404 });
      }
  
      return NextResponse.json(location, { status: 200 });  
    } catch (error) {
      console.error('Error finding location:', error);
      return NextResponse.json({ message: 'Error finding location', error: error.message }, { status: 500 });
    }
  }
