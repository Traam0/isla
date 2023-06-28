import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { useRef } from "react";
import {
	Hydrate,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import NextNProgress from "nextjs-progressbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { persistor, store } from "~/store/store";
import { PersistGate } from "redux-persist/integration/react";
// import { SessionProvider } from "next-auth/react";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	const querryClient = useRef(new QueryClient());

	return (
		<QueryClientProvider client={querryClient.current}>
			<Hydrate state={pageProps.dehydratedState}>
				<NextNProgress height={5} color="#E0AAFF" stopDelayMs={220} />
				<Provider store={store}>
					<PersistGate persistor={persistor}>
						{/* <SessionProvider session={session}> */}
						<Component {...pageProps} />
						{/* </SessionProvider> */}
					</PersistGate>
				</Provider>

				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</Hydrate>
		</QueryClientProvider>
	);
}
