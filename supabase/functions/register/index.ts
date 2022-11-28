// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "http://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import SHA256 from "https://cdn.jsdelivr.net/npm/crypto-js/sha256.js";
import Base64 from "https://cdn.jsdelivr.net/npm/crypto-js/enc-base64.js";
import { MailtrapClient } from "https://esm.sh/mailtrap@3.0.1";

serve(async (req) => {
	const { url, method, headers } = req;
	const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
	const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

	const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: "public" } });
	const body = await req.json();

	const taskPattern = new URLPattern({ pathname: '/restful-tasks/:id' });
	const matchingPath = taskPattern.exec(url);
	const id = matchingPath ? matchingPath.pathname.groups.id : null;

	if (id === "send") {
		const { email, name, lat, lng, captcha } = body;

		if (!email || !captcha || !name || !lat || !lng) {
			return new Response(JSON.stringify({
				message: "Unproccesable request, please provide the required fields",
			}), {
				status: 422,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		const response = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${Deno.env.get("RECAPTCHA_SECRET_KEY")}&response=${captcha}`,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
				},
				method: "POST",
			}
		);
		const captchaValidation = await response.json();

		if (!captchaValidation.success) {
			return new Response(JSON.stringify({
				message: "Unproccesable request, Invalid captcha code",
			}), {
				status: 422,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		const { data } = await supabase.from('markers').select('name').eq('email', email);
		if (data.length > 0) {
			return new Response(JSON.stringify({ error: "Email already exists" }), {
				status: 400,
				headers: {
					"content-type": "application/json",
				},
			});
		}

		const ENDPOINT = "https://send.api.mailtrap.io/";
		const client = new MailtrapClient({ endpoint: ENDPOINT, token: Deno.env.get("MAILTRAP_PASSWORD") || "" });

		const sender = {
			email: "furmap@dindin.ch",
			name: "Furmap registration service",
		};

		const recipients = [
			{
				email,
			}
		];

		const key = Base64.stringify(SHA256(process.env.CHECKSUM_PHRASE + "|" + email));

		await client
			.send({
				from: sender,
				to: recipients,
				subject: "Furmap verification",
				html: `<html><h1>New User</h1>
				<p>Hello, ${name}! You have been added to the Map. Please click the link below to confirm your email address.</p>
				<a href="https://${headers.host}/api/newUser?key=${encodeURIComponent(key)}&name=${encodeURIComponent(name)}&pos=${encodeURIComponent(JSON.stringify(pos))}&email=${encodeURIComponent(email)}">Confirm Email</a>
				<p>Thanks for subscribing!</p>`,
				category: "Registration",
			});

		return new Response(
			JSON.stringify(res),
			{ headers: { "Content-Type": "application/json" } },
		);
	}
});
