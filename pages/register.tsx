import ReCAPTCHA from "react-google-recaptcha";
import React, {
	useState,
	FormEvent,
	useEffect
} from "react";

const Register = () => {
	const recaptchaRef = React.createRef<ReCAPTCHA>();
	const [email, setEmail] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [pos, setPos] = useState<{ lat: number, lng: number; }>({ lat: 0, lng: 0 });
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		try {
			navigator?.geolocation.getCurrentPosition((pos) => {
				setPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
			});
		} catch (e) { console.log(e); }
	}, []);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		recaptchaRef.current?.execute();
	};

	const onReCAPTCHAChange = async (captchaCode: string | null) => {
		setLoading(true);
		if (recaptchaRef.current === null) {
			alert("reCAPTCHA Ref is null");
			setLoading(false);
			return;
		}

		if (email === "" || name === "" || pos.lat === 0 || pos.lng === 0) {
			alert("Please fill out all fields.");
			setLoading(false);
			return;
		}

		if (!(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(email)) {
			alert("Please enter a valid email address.");
			setLoading(false);
			return;
		}

		const tempEmail = await fetch("https://disposable.debounce.io/?email=" + email);

		if ((await tempEmail.json()).disposable === "true") {
			alert("Please use a non-disposable email address.");
			setLoading(false);
			return;
		}

		if (pos.lat < -90 || pos.lat > 90 || pos.lng < -180 || pos.lng > 180) {
			alert("Invalid location.");
			setLoading(false);
			return;
		}
		// If the reCAPTCHA code is null or undefined indicating that
		// the reCAPTCHA was expired then return early
		if (!captchaCode) {
			setLoading(false);
			return;
		}


		try {
			const response = await fetch("/api/newUser", {
				method: "POST",
				body: JSON.stringify({ email, name, pos, captcha: captchaCode }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			console.dir(response);
			if (response.status === 200) {
				// If the response is ok than show the success alert
				alert("Success! You will receive an email shortly.");
			} else {
				// Else throw an error with the message returned
				// from the API
				const error = await response.json();
				throw new Error(error.message);
			}
		} catch (error: any) {
			alert(error?.message || "Something went wrong");
			setLoading(false);
		} finally {
			// Reset the reCAPTCHA when the request has failed or succeeeded
			// so that it can be executed again if user submits another email.
			recaptchaRef.current?.reset();
			setEmail("");
			setName("");

			// Set the loading state to false so that the form can be submitted again
			setLoading(false);
		}

	};


	return (
		<>
			<form onSubmit={handleSubmit} method={"POST"} action={"/api/newUser"}>
				<ul>
					<li>
						<label htmlFor="name">Name</label>
						<input value={name} onChange={(e) => { setName(e.target.value); }} type="text" name="name" id="name" />
					</li>

					<li>
						<label htmlFor="email">E-mail (used for verification)</label>
						<input value={email} onChange={(e) => { setEmail(e.target.value); }} type="text" name="email" id="email" />
					</li>

					<li>
						<label htmlFor="lat">Latitude</label>
						<input value={pos.lat} onChange={(e) => { setPos({ lat: Number(e.target.value), lng: pos.lng }); }} type="number" name="lat" id="lat" />

						<label htmlFor="lng">Longitude</label>
						<input value={pos.lng} onChange={(e) => { setPos({ lat: pos.lat, lng: Number(e.target.value) }); }} type="number" name="lng" id="lng" />
					</li>

					<li>
						<button type="submit" disabled={loading}>
							{loading ? "Loading..." : "Register"}
						</button>
					</li>
				</ul>
			</form>
			<ReCAPTCHA
				size={"invisible"}
				ref={recaptchaRef}
				sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
				onChange={onReCAPTCHAChange}
			/>
		</>
	);
};

export default Register;
