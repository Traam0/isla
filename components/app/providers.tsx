// import { ReactNode, useRef } from "react";
// import {
// 	Hydrate,
// 	QueryClient,
// 	QueryClientProvider,
// } from "@tanstack/react-query";
// import NextNProgress from "nextjs-progressbar";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Provider } from "react-redux";
// import { persistor, store } from "~/store/store";
// import { PersistGate } from "redux-persist/integration/react";
// import { SessionProvider } from "next-auth/react";
// import { AppProps } from "next/app";

// interface ProviderProps {
// 	children: ReactNode;
// 	pageProps: AppProps;
// }

// export function Providers({
// 	children,
// 	pageProps: { session, ...pageProps },
// }: ProviderProps): JSX.Element {
// 	const querryClient = useRef(new QueryClient());

// 	return (
// 		<>
// 			<QueryClientProvider client={querryClient.current}>
// 				<Hydrate state={pageProps.dehydratedState}>
// 					<NextNProgress height={5} color="#E0AAFF" stopDelayMs={220} />
// 					<Provider store={store}>
// 						<PersistGate persistor={persistor}>
// 							<SessionProvider session={session}>{children}</SessionProvider>
// 						</PersistGate>
// 					</Provider>

// 					<ReactQueryDevtools initialIsOpen={false} />
// 				</Hydrate>
// 			</QueryClientProvider>
// 		</>
// 	);
// }
