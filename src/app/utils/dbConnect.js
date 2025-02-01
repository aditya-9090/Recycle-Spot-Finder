import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to the database.");
    return; // Already connected
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export default dbConnect;
