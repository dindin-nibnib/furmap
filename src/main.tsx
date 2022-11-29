import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Map from './map';
import Register from "./register";
import Info from "./info";
import Discord from "./discord";
import Geo from "./geo";
import Root from './root';
import Confirm from './confirm';

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '/',
				element: <Map />
			},
			{
				path: '/register',
				element: <Register />,
			},
			{
				path: '/info',
				element: <Info />,
			},
			{
				path: '/discord',
				element: <Discord />,
			},
			{
				path: '/geo',
				element: <Geo />,
			},
			{
				path: '/confirm',
				element: <Confirm />
			}
		]
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={routes} />
	</React.StrictMode>
);
