import Slider from "react-slick"
import ProductCard from "../../product/ProductCard";

export const BestSellingProducts = ({ bsProducts }) => {

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        speed: 4000,
        autoplaySpeed: 2000,
        cssEase: "linear"
    };

    return (
        <>
            <h6>Best Selling Products</h6>
            <Slider {...settings}>
                {
                    bsProducts && bsProducts.length !== 0 ? bsProducts.map(product => (
                        <div key={product._id} className="productsCarousel">
                            <ProductCard key={product._id} product={product} viewOnly={true} />
                        </div>
                    )) : <h2>No Products</h2>
                }
            </Slider>
        </>
    )
}