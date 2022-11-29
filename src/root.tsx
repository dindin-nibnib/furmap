import { Link, Outlet } from "react-router-dom";
import markerSmall from '/src/images/marker_small.png';

const Root = () => {
	return (
		<>
			<header>
				<nav>
					<ul>
						<li>
							<Link to="/">
								<img src={markerSmall} alt={"Furnet's Marker image"}></img>
								<h1>Furmap</h1>
							</Link>
						</li>
						<li>
							<Link to="/">Map</Link>
						</li>
						<li>
							<Link to="/info">Info</Link>
						</li>
						<li>
							<Link to="/discord">Discord</Link>
						</li>
						<li>
							<Link to="/geo">Geo</Link>
						</li>
						<li>
							<a href={"https://twitter.com/Furmap_net"}>Twitter</a>
						</li>
					</ul>
				</nav>
			</header>

			<main style={{ position: "relative" }}>
				<Outlet />
			</main>
		</>
	);
};

export default Root;
