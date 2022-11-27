import Link from 'next/link';
import Image from 'next/image';
import markerSmall from '../public/images/marker_small.png';

const Root = ({ children }: { children: JSX.Element; }) => {
	return (
		<>
			<header>
				<nav>
					<ul>
						<li>
							<Link href="/">
								<Image src={markerSmall} alt={"Furnet's Marker image"}></Image>
								<h1>Furmap</h1>
							</Link>
						</li>
						<li>
							<Link href="/">Map</Link>
						</li>
						<li>
							<Link href="/info">Info</Link>
						</li>
						<li>
							<Link href="/discord">Discord</Link>
						</li>
						<li>
							<Link href="/geo">Geo</Link>
						</li>
						<li>
							<a href={"https://twitter.com/Furmap_net"}>Twitter</a>
						</li>
					</ul>
				</nav>
			</header>

			<main style={{ position: "relative" }}>
				{children}
			</main>
		</>
	);
};

export default Root;
