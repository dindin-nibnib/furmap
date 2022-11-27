import { Link } from 'react-router-dom';

const Info = () => {
	return (
		<>
			<h2>Info</h2>
			<p>Furmap has been existing for more than 3 years.</p>

			<p>
				This website is not the official one!
				It's a fork of the original, but written with nextjs, and is maintained by <Link to={"https://dindin.ch"}>dindin</Link>.
				The original website can be found here: <Link to={"https://furmap.net"}>furmap.net</Link>.
			</p>
		</>
	);
};

export default Info;
