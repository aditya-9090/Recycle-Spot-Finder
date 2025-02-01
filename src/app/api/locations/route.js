import { NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import Location from '@/app/models/Location';

// GET: Fetch all locations
export async function GET() {
  try {
    await dbConnect();  // Connect to the database
    const locations = await Location.find({}).lean();  // Fetch all locations
    console.log('Fetched locations:', locations);  // Log fetched locations
    return NextResponse.json(locations, { status: 200 });  // Return locations as JSON
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ message: 'Error fetching locations', error: error.message }, { status: 500 });
  }
}

// POST: Create a new location
export async function POST(req) {
  try {
    const { name, wasteType, availability, latitude, longitude } = await req.json();
    console.log({ name, wasteType, availability, latitude, longitude });
    // Validate required fields
    if (!name || !wasteType || !availability || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect(); // Connect to the database

    // Create and save the new location
    const newLocation = await Location.create({
      name,
      wasteType,
      availability,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
      },
    });

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating location', error: error.message }, { status: 500 });
  }
}