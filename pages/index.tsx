import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import 'leaflet/dist/leaflet.css';
import { MongoClient } from 'mongodb';


export async function getServerSideProps() {
	const uri = process.env.MONGO_CONNECTION_STRING || "";
	let client = new MongoClient(uri, {});
	await client.connect();
	const db = client.db("furmap");
	let markersRes = await db.collection("markers").find({}).toArray();
	let markers = JSON.parse(JSON.stringify(markersRes)) as Array<any>;
	client.close();

	return {
		props: { markers },
	};
}

const MapComponent = dynamic(
	() => import('../components/constructedMap'),
	{ ssr: false }
);

const Map = ({ markers }: { markers: { position: { lng: number, lat: number; }, name: string, _id: number; }[]; }) => {
	return (
		<>
			<Suspense>
				<MapComponent markers={markers} />
			</Suspense>
			<button className={"float-abs fl-top fl-right"} style={{ zIndex: 1000 }} onClick={() => { window.location.href = "/register"; }}>Register</button>
		</>
	);
};

export default Map;
