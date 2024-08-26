import Image from "next/image";
import Link from "next/link";

export const ShopByCategories = ({ categories }) => {

    return (
        <>
            {categories &&
                <div className="card">
                    <h6>Shop By Category</h6>
                    <div className='category-cards-container'>
                        {categories.map((category, i) => (
                            <Link key={category + i} href={`/productSearch/?category=${category._id}`}>
                                <div className="category-card">
                                    <div className='img-container'>
                                        <Image src={category.img} alt={category.name}
                                            width={50}
                                            height={50}
                                        ></Image>
                                    </div>
                                    <label>{category.name}</label>
                                </div>
                            </Link>
                        ))
                        }
                    </div>
                </div>
            }
        </>
    );
}