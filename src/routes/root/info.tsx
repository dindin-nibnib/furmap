import { Link } from "react-router-dom";

const Info = () => {
	return (
		<>
			<h2>Info</h2>
			<p>Furmap has been existing for more than 3 years.</p>

			<p>This website fist was created by {"<creator name>"}, and is now maintained by <Link to="https://dindin.ch">dindin</Link>.</p>
		</>
	);
};

export default Info;
