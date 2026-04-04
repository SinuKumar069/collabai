import mongoose, { Mongoose } from "mongoose";

interface MongoCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var _mongoose: MongoCache | undefined;
}

const mongoUri = (() => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    return uri;
})();

const cache: MongoCache = global._mongoose || { conn: null, promise: null };

if (!global._mongoose) {
    global._mongoose = cache;
}

async function dbConnect(): Promise<Mongoose> {
    if (cache.conn) {
        console.log("✓ Using cached MongoDB connection");
        return cache.conn;
    }

    if (!cache.promise) {
        console.log("→ Establishing new MongoDB connection...");
        cache.promise = mongoose
            .connect(mongoUri)
            .then((instance) => {
                console.log("✓ MongoDB connected");
                return instance;
            })
            .catch((err) => {
                console.error("✗ MongoDB connection failed:", err.message);
                cache.promise = null;
                throw err;
            });
    }

    cache.conn = await cache.promise;
    return cache.conn;
}

export default dbConnect;