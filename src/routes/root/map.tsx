import {
	MapContainer,
	TileLayer,
	Popup,
	Marker
} from 'react-leaflet';
import { Icon } from 'leaflet';
import markerImage from '../../assets/marker_small.png';

const Map = () => {
	const icon = new Icon({
		iconUrl: markerImage,
		iconSize: [50, 50],
	});
	return (
		<>
			<MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: "calc(100vh - 56px)" }}>
				<TileLayer
					attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
					url={"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"}
				/>

				<Marker position={[51.505, -0.09]} icon={icon}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
				<Marker position={[51.505, -0.08]} icon={icon}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
			</MapContainer>
		</>
	);
};

export default Map;
