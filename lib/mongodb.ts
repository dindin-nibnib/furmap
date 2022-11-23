import { MongoClient } from 'mongodb';

let client;
let clientPromise: Promise<MongoClient>;

const password = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://dindin:${password}@cluster0.7jo6bwn.mongodb.net/?retryWrites=true&w=majority`;
client = new MongoClient(uri, {});

clientPromise = client.connect();
export default clientPromise;
