// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "http://deno.land/std@0.131.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
	const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
	const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

	const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: "public" } });
	const { data } = await supabase.from('markers').select('name');

	const res = {
		message: `Hello ${data[0].name}!`,
	};

	return new Response(
		JSON.stringify(res),
		{ headers: { "Content-Type": "application/json" } },
	);
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
