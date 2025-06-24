// /pages/_app.js

import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import Head from 'next/head'; // 1. Import the Head component

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // 2. Use a Fragment (<>) to wrap multiple components
    <>
      <Head>
        <title>Post Armory</title> {/* 3. Set your default site title here */}
        <link rel="icon" href="/logo.png" /> {/* 4. Add the link to your icon */}
      </Head>
      
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}