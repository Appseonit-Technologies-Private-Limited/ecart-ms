import Head from 'next/head'
import Dashboard from '../components/Dashboard/Dashboard';


const dashboard = () => {

    return (
        <>
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Dashboard`}</title>
            </Head>
            <Dashboard />
        </>
    );
}
export default dashboard;