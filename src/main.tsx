import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import 'leaflet/dist/leaflet.css';
import Root from './routes/root';
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom';
import Map from './routes/root/map';
import Info from './routes/root/info';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root/>,
		children: [
			{
				path: "/",
				element: <Map/>,
			},
			{
				path: "/info",
				element: <Info/>,
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);
