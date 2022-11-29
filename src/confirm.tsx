import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { supabase } from './supabaseClient';


const Confirm = () => {
	const route = useLocation();
	const [confirmed, setConfirmed] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		supabase.functions.invoke("verify");
		console.log("effect!");
		fetch(`https://${import.meta.env.VITE_PROJECT_ID}.functions.supabase.co/register/verify${route.search}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Request-Method": "GET",
				"Authorization": "Bearer " + import.meta.env.VITE_SUPABASE_ANON_KEY,
				"Access-Control-Request-Headers": "Content-Type, Authorization"
			},
		}).then(async (response) => {
			if (response.status === 200) {
				setConfirmed(true);
			} else {
				setConfirmed(false);
				setError((await response.json()).message);
			}
		});
	}, []);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			{
				confirmed === null ?
					<div className="flex flex-col items-center justify-center">
						<h1 className="text-3xl font-bold">Verifying...</h1>
					</div>
					:
					confirmed ?
						<div className="flex flex-col items-center justify-center">
							<h1 className="text-3xl font-bold">Your account has been verified.</h1>
						</div>
						:
						<div className="flex flex-col items-center justify-center">
							<h1 className="text-3xl font-bold">There was an error verifying your account.</h1>
							<p className="text-xl">{error}</p>
						</div>
			}
		</div>
	);
};

export default Confirm;
