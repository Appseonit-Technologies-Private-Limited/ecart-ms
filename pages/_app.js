import '../styles/globals.css'
import Layout from '../components/Layout'
import { DataProvider } from '../store/GlobalState'
import CookieConsent from './CookieConsent'
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: '100',
  subsets: ['latin'],
})

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component className={roboto.className} {...pageProps} />
        <CookieConsent />
      </Layout>
    </DataProvider>
  )
}

export default MyApp
