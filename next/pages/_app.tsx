import '../styles/index.scss';
import type { AppProps } from 'next/app';
import RootLayout from '../layouts/root';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RootLayout>
			<Component {...pageProps} />
		</RootLayout>
	);
}
