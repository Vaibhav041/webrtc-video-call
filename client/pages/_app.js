import { SocketProvider } from "@/context/SocketProvider";
import "@/styles/globals.css";
import "webrtc-adapter";

export default function App({ Component, pageProps }) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  );
}
