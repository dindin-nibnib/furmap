import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
import { MongoClient } from 'mongodb';
import { MailtrapClient } from "mailtrap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { body, method } = req;

	// Extract the email and captcha code from the request body
	const { email, name, pos, captcha } = body;

	if (method === "POST") {
		// If email or captcha are missing return an error
		if (!email || !captcha || !name || !pos) {
			return res.status(422).json({
				message: "Unproccesable request, please provide the required fields",
			});
		}

		try {
			const uri = process.env.MONGO_CONNECTION_STRING || "";
			let client = new MongoClient(uri, {});
			await client.connect();
			const db = client.db('furmap');
			const collection = db.collection('markers');
			if (await collection.findOne({ email: email }) !== null) {
				return res.status(422).json({
					message: "Email already exists",
				});
			}

			// Ping the google recaptcha verify API to verify the captcha code you received
			const response = await fetch(
				`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
					},
					method: "POST",
				}
			);
			const captchaValidation = await response.json();
			/**
			 * The structure of response from the veirfy API is
			 * {
			 *  "success": true|false,
			 *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
			 *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
			 *  "error-codes": [...]        // optional
				}
			 */
			if (captchaValidation.success) {
				const ENDPOINT = "https://send.api.mailtrap.io/";
				const client = new MailtrapClient({ endpoint: ENDPOINT, token: process.env.MAILTRAP_PASSWORD || "" });

				const sender = {
					email: "furmap@dindin.ch",
					name: "Furmap registration service",
				};

				const recipients = [
					{
						email,
					}
				];

				const key = crypto.createHash('sha256').update(process.env.CHECKSUM_PHRASE + "|" + email).digest('base64');

				await client
					.send({
						from: sender,
						to: recipients,
						subject: "Furmap verification",
						html: `<html><h1>New User</h1>
						<p>Hello, ${name}! You have been added to the Map. Please click the link below to confirm your email address.</p>
						<a href="https://${req.headers.host}/api/newUser?key=${encodeURIComponent(key)}&name=${encodeURIComponent(name)}&pos=${encodeURIComponent(JSON.stringify(pos))}&email=${encodeURIComponent(email)}">Confirm Email</a>
						<p>Thanks for subscribing!</p>`,
						category: "Registration",
					});

				// Return 200 if everything is successful
				return res.status(200).send("OK");
			};

			return res.status(422).json({
				message: "Unproccesable request, Invalid captcha code",
			});
		} catch (error) {
			console.log(error);
			return res.status(422).json({ message: "Something went wrong" });
		}
	} else if (method === "GET") {
		const { key, name, pos, email } = req.query;
		if (!key || !pos || !name || !email) {
			return res.status(422).json({
				message: "Unproccesable request, please provide the required fields",
			});
		}

		try {
			const keyCheck = crypto.createHash('sha256').update(process.env.CHECKSUM_PHRASE + "|" + email).digest('base64');

			if (keyCheck !== key) {
				return res.status(422).json({
					message: "The token is invalid",
				});
			}

			const uri = process.env.MONGO_CONNECTION_STRING || "";
			let client = new MongoClient(uri, {});
			await client.connect();
			const db = client.db('furmap');
			await db.collection('markers').insertOne({
				"_id": undefined,
				"position": JSON.parse(pos.toString()),
				"name": name.toString(),
				"email": email.toString()
			});

			// Return 200 if everything is successful
			return res.status(200).send("Success");

		} catch (error) {
			console.log(error);
			return res.status(422).json({ message: "Something went wrong" });
		}
	}
	// Return 404 if someone pings the API with a method other than
	// POST
	return res.status(404).send("Not found");
}
