import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  wasteType: { type: String, required: true },
  availability: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'], // Specifies the GeoJSON type
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers: [longitude, latitude]
      required: true,
    },
  },
});

// Create a 2dsphere index for geospatial queries
LocationSchema.index({ location: '2dsphere' });

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);
export default Location;
