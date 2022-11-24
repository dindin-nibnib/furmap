import ReCAPTCHA from "react-google-recaptcha";
import React, {
	useState,
	useRef,
	FormEvent
} from "react";

const Register = () => {
	const recaptchaRef = React.createRef<ReCAPTCHA>();
	const [email, setEmail] = React.useState<string>("");
	const [name, setName] = React.useState<string>("");
	const [pos, setPos] = React.useState<{ lat: number, lng: number; }>({ lat: 0, lng: 0 });

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (recaptchaRef.current === null)
			return;

		// Execute the reCAPTCHA when the form is submitted
		recaptchaRef.current.execute();
	};

	const onReCAPTCHAChange = async (captchaCode: string | null) => {
		// If the reCAPTCHA code is null or undefined indicating that
		// the reCAPTCHA was expired then return early
		if (!captchaCode) {
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
			if (response.ok) {
				// If the response is ok than show the success alert
				alert("Email registered successfully");
			} else {
				// Else throw an error with the message returned
				// from the API
				const error = await response.json();
				throw new Error(error.message);
			}
		} catch (error: any) {
			alert(error?.message || "Something went wrong");
		} finally {
			// Reset the reCAPTCHA when the request has failed or succeeeded
			// so that it can be executed again if user submits another email.
			recaptchaRef.current?.reset();
			setEmail("");
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
						<ReCAPTCHA
							ref={recaptchaRef}
							size={"invisible"}
							sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
							onChange={onReCAPTCHAChange}
						/>
					</li>

					<li>
						<button type="submit">Register</button>
					</li>
				</ul>
			</form>
		</>
	);
};

export default Register;
