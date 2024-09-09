import '../styles/globals.css'
import Layout from '../components/Layout'
import { DataProvider } from '../store/GlobalState'
import CookieConsent from './CookieConsent'
import { Roboto } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const roboto = Roboto({
  weight: '100',
  subsets: ['latin'],
})

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <DataProvider>
      <Layout>
        {loading && <div className="loading-spinner"><div className="loader"></div></div>}
        <Component className={roboto.className} {...pageProps} />
        <CookieConsent />
      </Layout>
    </DataProvider>
  )
}

export default MyApp
