// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "http://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import crypto from "https://esm.sh/crypto@1.0.1";
import { MailtrapClient } from "https://esm.sh/mailtrap@3.0.1";

serve(async (req) => {
	const { url, method } = req;
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

		const { data } = await supabase.from('markers').select('name').eq('email', email);
		if (data.length > 0) {
			return new Response(JSON.stringify({ error: "Email already exists" }), {
				status: 400,
				headers: {
					"content-type": "application/json",
				},
			});
		}

		return new Response(
			JSON.stringify(res),
			{ headers: { "Content-Type": "application/json" } },
		);
	}
});
