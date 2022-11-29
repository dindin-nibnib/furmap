// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve, type Handler } from "http://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import SHA256 from "https://cdn.jsdelivr.net/npm/crypto-js/sha256.js/+esm";
import Base64 from "https://cdn.jsdelivr.net/npm/crypto-js/enc-base64.js/+esm";
import { SmtpClient } from 'https://deno.land/x/denomailer@0.12.0/mod.ts';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, referer, user-agent, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform',
};
const smtp = new SmtpClient();

serve(async (req: Request): Handler => {
	const { url, method, headers } = req;

	if (method === "OPTIONS") {
		return new Response('ok', {
			status: 200,
			headers: {
				...corsHeaders,
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			},
		});
	}
	const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
	const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

	const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: "public" } });

	const idPattern = new URLPattern({ pathname: '/register/:id' });
	const matchingPath = idPattern.exec(url);
	const id = matchingPath ? matchingPath.pathname.groups.id : null;

	if (id === "send") {
		const body = await req.json();
		const { email, name, lat, lng, captcha } = body;

		if (!email || !captcha || !name || !lat || !lng) {
			return new Response(JSON.stringify({
				message: "Unproccesable request, please provide the required fields",
			}), {
				status: 422,
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
			});
		}

		const response = await fetch(
			`https://www.google.com/recaptcha/api/siteverify?secret=${Deno.env.get("RECAPTCHA_SECRET_KEY")}&response=${captcha}`,
			{
				headers: {
					...corsHeaders,
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
					...corsHeaders,
					"Content-Type": "application/json",
				},
			});
		}

		const { data } = await supabase.from('markers').select('name').eq('email', email);
		if (data.length > 0) {
			return new Response(JSON.stringify({ message: "Email already exists" }), {
				status: 400,
				headers: {
					...corsHeaders,
					"content-type": "application/json",
				},
			});
		}

		await smtp.connect({
			hostname: Deno.env.get('SMTP_HOSTNAME')!,
			port: Number(Deno.env.get('SMTP_PORT')!),
			username: Deno.env.get('SMTP_USERNAME')!,
			password: Deno.env.get('SMTP_PASSWORD')!,
		});

		const sender = "furmap@dindin.ch";

		const key = Base64.stringify(SHA256(Deno.env.get("CHECKSUM_PHRASE") + "|" + email));

		try {
			await smtp.send({
				from: sender,
				to: email,
				subject: `Furmap verification`,
				html: `<html><h1>New User</h1>
				<p>Hello, ${name}! You have been added to the Map. Please click the link below to confirm your email address.</p>
				<a href="${headers.get("origin")}/confirm?key=${encodeURIComponent(key)}&name=${encodeURIComponent(name)}&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&email=${encodeURIComponent(email)}">Confirm Email</a>
				<p>Thanks for subscribing!</p>`,
			});
		} catch (error) {
			return new Response(
				JSON.stringify({ message: "Error during smtp sending:" + error.message }), {
				status: 500,
				headers: {
					...corsHeaders,
					"content-type": "application/json",
				},
			});
		}

		return new Response(
			JSON.stringify({ message: "Email sent" }),
			{
				headers: {
					...corsHeaders,
					"Content-Type": "application/json"
				}
			},
		);
	} else if (id === "verify") {
		const key = new URL(req.url).searchParams.get("key");
		const name = new URL(req.url).searchParams.get("name");
		const lat = new URL(req.url).searchParams.get("lat");
		const lng = new URL(req.url).searchParams.get("lng");
		const email = new URL(req.url).searchParams.get("email");
		if (!key || !name || !lat || !lng || !email) {
			return new Response(JSON.stringify({
				message: "Unproccesable request, please provide the required fields",
			}), {
				status: 422,
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
			});
		}

		const checksum = Base64.stringify(SHA256(Deno.env.get("CHECKSUM_PHRASE") + "|" + email));
		if (checksum !== key) {
			return new Response(JSON.stringify({
				message: "Unproccesable request, invalid key",
			}), {
				status: 422,
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
			});
		}

		const { data } = await supabase.from('markers').select('name').eq('email', email);
		console.log(data);
		if (data.length > 0) {
			return new Response(JSON.stringify({ message: "Email already exists" }), {
				status: 400,
				headers: {
					...corsHeaders,
					"content-type": "application/json",
				},
			});
		}

		const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL") || "";
		const supabaseServiceKey = Deno.env.get("SERVICE_KEY") || "";


		const insertClient = createClient(supabaseUrl, supabaseServiceKey);

		const { error } = await insertClient.from('markers').insert(
			{
				name,
				lat,
				lng,
				email,
			}
		);

		if (error) {
			return new Response(JSON.stringify({ message: "Error during insert" }), {
				status: 500,
				headers: {
					...corsHeaders,
					"content-type": "application/json",
				},
			});
		}

		return new Response(
			JSON.stringify({ message: "Email verified" }),
			{
				status: 200,
				headers: {
					...corsHeaders,
					"Content-Type": "application/json"
				}
			},
		);
	} else {
		return new Response(JSON.stringify({ message: "Invalid request" }), {
			status: 400,
			headers: {
				...corsHeaders,
				"content-type": "application/json",
			},
		});
	}
});
