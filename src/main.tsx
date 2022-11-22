import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './routes/root';
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root/>,
	}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);
