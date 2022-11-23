import {
	MapContainer,
	TileLayer,
	Popup,
	Marker,
	useMap
} from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from "react";
import markerImage from '/public/images/marker_small.png';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const mcg = L.markerClusterGroup({
	showCoverageOnHover: true,
	zoomToBoundsOnClick: true,
	spiderfyOnMaxZoom: true,

});

const icon = L.icon({
	iconUrl: markerImage.src,
	iconSize: [41, 41],
});


const MarkerCluster = ({ markers }: { markers: { position: { lng: number, lat: number; }, name: string, _id: number; }[]; }) => {
	const map = useMap();

	useEffect(() => {
		mcg.clearLayers();
		markers.forEach(({ position, name }) => {
			return L.marker(new L.LatLng(position.lat, position.lng), {
				icon: icon
			})
				.addTo(mcg)
				.bindPopup(name);
		}
		);

		// optionally center the map around the markers
		// map.fitBounds(mcg.getBounds());
		// // add the marker cluster group to the map
		map.addLayer(mcg);
	}, [markers, map]);
	return null;
};

export default ({ markers }: { markers: { position: { lat: number, lng: number; }, name: string, _id: number; }[]; }) => {
	return (<MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: "calc(100vh - 56px)" }}>
		<TileLayer
			attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
			url={"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"}
		/>
		<MarkerCluster markers={markers} />
	</MapContainer>);
};
