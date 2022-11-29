import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import Base64 from "https://cdn.jsdelivr.net/npm/crypto-js/enc-base64.js/+esm";
import SHA256 from "https://cdn.jsdelivr.net/npm/crypto-js/sha256.js/+esm";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.1";


const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, referer, user-agent, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform',
};

serve(async (req: Request): Promise<Response> => {
	const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
	const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
	const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: "public" } });

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
	if ((data?.length || 0) > 0) {
		return new Response(JSON.stringify({ message: "Email already exists" }), {
			status: 400,
			headers: {
				...corsHeaders,
				"content-type": "application/json",
			},
		});
	}

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
});
