import Head from 'next/head'
import OrderDetail from '../components/Orders/OrderDetail'



const Order = () => {
    return (
        <div className="container-fluid my-3">
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Order Detail`}</title>
            </Head>
            <OrderDetail />
        </div>
    )
}

export default Order