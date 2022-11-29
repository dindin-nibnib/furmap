import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { supabase } from './supabaseClient';


const Confirm = () => {
	const route = useLocation();
	const [confirmed, setConfirmed] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		let body = {} as { [index: string]: string; };
		for (let param of route.search.slice(1).split("&")) {
			body[param.split("=")[0]] = param.split("=")[1];
		}
		supabase.functions.invoke("verify", {
			body: {
				...body
			}
		})
			.then(async (response) => {
				if (!response.error) {
					setConfirmed(true);
				} else {
					setConfirmed(false);
					setError((await response.error.context.json()).message);
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
