import { SessionProvider } from "@stevesouth/next-auth/react";
import "./styles.css";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
