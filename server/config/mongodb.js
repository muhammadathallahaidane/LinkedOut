import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"

export const client = new MongoClient(uri)

export let db = null

function connect() {
  db = client.db("gc01-linkedout")
  return db
}

export function getDB() {
  if (!db) return connect()
  return db
}
