import markerSmall from "../assets/marker_small.png";
import { Outlet, Link } from "react-router-dom";

const Root = () => {
	return (
		<>
			<header>
				<nav>
					<ul>
						<li>
							<Link to="/">
								<img src={markerSmall} alt="Furmap's marker" />
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

			<main>
				<Outlet />
			</main>
		</>
	);
};

export default Root;
