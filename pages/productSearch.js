import Head from 'next/head'
import { ProductSearch } from '../components/product/ProductSearch';

const productSearch = () => {

    return (
        <div className="container-fluid justify-content-between">
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Search`}</title>
            </Head>
            <ProductSearch />
        </div>
    );
}
export default productSearch;