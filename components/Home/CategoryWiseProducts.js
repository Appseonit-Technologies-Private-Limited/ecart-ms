
import ProductCard from '../product/ProductCard';


function CategoryWiseProducts({ catWiseProducts }) {
    return (
        <>
            {
                catWiseProducts && catWiseProducts.map(
                    (cat, i) => (
                        cat.products && (
                            <div key={`${cat.name}-catwiseProd${i}`} className='my-3 card'>
                                <h6>{cat.name}</h6>
                                <div className='catwise-prod-container'>
                                    {
                                        cat.products.map(product => (
                                            <div key={`${product._id}-catwiseProd${i}`} className='product-card'>
                                                <ProductCard key={product._id} product={product} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )

                    )
                )
            }
        </>
    );
}

export default CategoryWiseProducts;