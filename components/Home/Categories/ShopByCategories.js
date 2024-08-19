import Link from "next/link";

export const ShopByCategories = ({ categories }) => {

    return (
        <>
            {categories &&
                <>
                    <h6>Shop By Category</h6>
                    <div className='row justify-content-center'>
                        {categories.map((category, i) => (
                            <Link key={category + i} href={`/productSearch/?category=${category._id}`}>
                                <div className="m-1 category-card">
                                    <div className='pt-2 category-img-div'>
                                        <img className="category-img" src={category.img} />
                                    </div>
                                    <label>{category.name}</label>
                                </div>
                            </Link>
                        ))
                        }
                    </div>
                </>
            }
        </>
    );
}