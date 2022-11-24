import { MongoClient } from 'mongodb';

let client;
let clientPromise: Promise<MongoClient>;

const uri = process.env.MONGO_CONNECTION_STRING || "";
client = new MongoClient(uri, {});

clientPromise = client.connect();
export default clientPromise;
