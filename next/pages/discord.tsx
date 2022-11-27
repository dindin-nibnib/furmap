const Discord = () => {
	return (
		<div className={"margin"}>
			<h2>Discord Server</h2>
			<div className={"row"}>
				<div className={"col"}>
					<p>
						Furmap has a discord server !
						Join the community and chat with members around the world.
					</p>
					<p>
						Rules :
						Here are a few rules in the server :
					</p>
					<ul>
						<li>This server is Safe For Work, please do not post any NSFW content on it.</li>
						<li>Respect everyone, do not be mean or offensive.</li>
						<li>This server is mainly to discuss about furmap, although you are allowed to talk about anything !</li>
						<li>You can invite your friends on it !</li>
					</ul>
					<button className={"accent"} onClick={() => { window.location.href = "https://discord.gg/fgjADKh"; }}>
						Join the server
					</button>
				</div>

				<div className={"col"}>
					<iframe title={"Discord server"} src="https://canary.discord.com/widget?id=684020556596510793&theme=dark" allowTransparency frameBorder={0} width={350} height={500} />
				</div>
			</div>
		</div>
	);
};

export default Discord;
