import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContextProvider } from "../context/AuthContext";
import "../styles/globals.css";
import 'fontsource-nunito'
import { useEffect } from "react";

const noAuthRequired = ['/', '/login', '/signup']


function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Load the Nunito font asynchronously
    document.fonts.load('1em Nunito')
  }, [])
  const router = useRouter()
  return (
    <>

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
