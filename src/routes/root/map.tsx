import {
	MapContainer,
	TileLayer,
	Popup,
	Marker,
} from 'react-leaflet';

const Map = () => {
	return (
		<>
			{/*<MapContainer
			center={[51.505, -0.09]}
			zoom={13}
			scrollWheelZoom={false}
		>
			<TileLayer
				url="https://{w}.basemaps.cartocdn.com/dark_all/{x}/{y}/{z}.png"
			/>
	</MapContainer>*/}
			<MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height:"100%"}}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
				/>
				<Marker position={[51.505, -0.09]}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
			</MapContainer>
		</>
	);
};

export default Map;
