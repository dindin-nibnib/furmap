import geoRef from "../../assets/Ref_Geo_Furmap.png";
import geoStick from "../../assets/Stick_Geo_Furmap.png";

const Geo = () => {
	return (
		<div className={"margin"}>
			<h2>Géo</h2>
			<p>Géo is the official mascot of furmap. He was originaly created by Violet Cross !</p>
			<h3>Usage</h3>
			<p><strong>YOU MUST GIVE CREDIT (either to this page or to Violet Cross)</strong>
			</p>
			<p><strong>you CAN NOT</strong></p>
			<ul>
				<li>Create NSFW Art of Géo</li>
				<li>Use these images to create your own fursona, fursuit, etc...</li>
				<li>Use these images commercialy without authorisation</li>
			</ul>
			<p><strong>you CAN</strong></p>
			<ul>
				<li>
					Create SFW art of Géo. If you do please contact us at <a href="mailto:webmaster@furmap.net">webmaster@furmap.net</a> so that we can add it here !
				</li>
				<li>
					Add the sticker pack on Telegram <a href="https://t.me/addstickers/furmap">https://t.me/addstickers/furmap</a>
				</li>
			</ul>
			<img className={"big"} src={geoRef} alt="Furmap mascot reference sheet" />
			<br />
			<img className={"big"} src={geoStick} alt="furmap mascot sticker sheet" />

		</div>
	);
};

export default Geo;
