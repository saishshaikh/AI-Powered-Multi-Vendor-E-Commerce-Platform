import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    const mongoDbUrl = process.env.MONGODB_URL;
    if (!mongoDbUrl) {
        throw new Error("MONGODB_URL is not defined in environment variables");
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(mongoDbUrl, opts).then((m) => m.connection);
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

export default connectDb;