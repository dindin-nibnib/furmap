import markerSmall from "../assets/marker_small.png";
import { Outlet, Link } from "react-router-dom";

const Root = () => {
	return(
		<>
			<header>
				<img src={markerSmall} alt="Furmap's marker" />
				<h1>Furmap</h1>
				<nav>
					<ul>
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
							<Link to="https://twitter.com/Furmap_net">Twitter</Link>
						</li>
				</ul>
				</nav>
			</header>

			<main>
				<Outlet/>
			</main>
		</>
	)
}

export default Root;
