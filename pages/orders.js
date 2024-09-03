import Head from 'next/head'
import Orders from '../components/Orders/Orders';


const orders = () => {

    return (
        <div className="container justify-content-between">
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Orders`}</title>
            </Head>
            <Orders />
        </div>
    );
}
export default orders;