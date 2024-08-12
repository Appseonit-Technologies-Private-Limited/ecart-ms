import '../styles/globals.css'
import Layout from '../components/Layout'
import { DataProvider } from '../store/GlobalState'
import CookieConsent from './CookieConsent'

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component {...pageProps} />
        <CookieConsent />
      </Layout>
    </DataProvider>
  )
}

export default MyApp
