import mongoose from "mongoose";

export async function connectDatabase() {
  // A local MongoDB instance is the default development setup. Use MONGODB_URI
  // when connecting to MongoDB Atlas or a different local database.
  const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/sky-mart";

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
