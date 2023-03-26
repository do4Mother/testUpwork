import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContextProvider } from "../context/AuthContext";
import "../styles/globals.css";
import 'fontsource-nunito'
import { useEffect } from "react";
import Script from 'next/script'

const noAuthRequired = ['/', '/login', '/signup']


function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Load the Nunito font asynchronously
    document.fonts.load('1em Nunito')
  }, [])
  const router = useRouter()
  return (
    <>
<Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-23E0PEG895"/>
<Script
  id='google-analytics'
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
__html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-23E0PEG895', {
  page_path: window.location.pathname,
 });
`,
}}
 />
    <AuthContextProvider>
      <Navbar/>
      {noAuthRequired.includes(router.pathname) ? (
        <Component {...pageProps} />
      ):(
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthContextProvider>
    </>
  );
}

export default MyApp;
