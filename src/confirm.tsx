import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";


const Confirm = () => {
	const route = useLocation();
	const [confirmed, setConfirmed] = useState<boolean | null>(null);
	useEffect(() => {
		(
			async () => {
				const response = await fetch(`https://${import.meta.env.VITE_PROJECT_ID}.functions.supabase.co/register/verify${route.search}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Request-Method": "GET",
						"Authorization": "Bearer " + import.meta.env.VITE_SUPABASE_ANON_KEY,
						"Access-Control-Request-Headers": "Content-Type, Authorization"
					},
				});

				setConfirmed(response.status === 200);
			}
		)();
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
						</div>
			}
		</div>
	);
};

export default Confirm;
