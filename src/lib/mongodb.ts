import mongoose from "mongoose"

const MONGO_DB = process.env.MONGO_DB ?? "future_cases"
const MONGODB_URI = process.env.MONGODB_URI

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache
}

const cached = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
}

globalWithMongoose.mongooseCache = cached

export async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured")
  }

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGO_DB,
      authSource: "admin",
      serverSelectionTimeoutMS: 5000,
    })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    cached.promise = null
    throw error
  }
}
