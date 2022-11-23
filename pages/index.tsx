import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import clientPromise from '../lib/mongodb';
import 'leaflet/dist/leaflet.css';

export async function getServerSideProps() {
	const client = await clientPromise;
	const db = client.db("furmap");
	let markersRes = await db.collection("markers").find({}).toArray();
	let markers = JSON.parse(JSON.stringify(markersRes)) as Array<any>;

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
		<Suspense>
			<MapComponent markers={markers} />
		</Suspense>
	);
};

export default Map;