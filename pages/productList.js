import Head from 'next/head'
import { ProductList } from '../components/product/ProductList';

const products = () => {

    return (
        <div className="container-fluid justify-content-between">
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Product List`}</title>
            </Head>
            <ProductList />
        </div>
    );
}
export default products;