import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { getData } from '../utils/fetchData'
import ControlledCarousel from '../components/Carousel'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePageCards from '../components/Home/HomePageCards'
import { ShopByCategories } from '../components/Home/Categories/ShopByCategories'
import { BestSellingProducts } from '../components/Home/BestSellingProducts/BestSellingProducts'
import { CategoryDisplayItems } from '../components/Home/Categories/CategoryDisplayItems'
import CategoryWiseProducts from '../components/Home/CategoryWiseProducts'

const Home = (props) => {

  const [bsProducts, setBsProducts] = useState(props.bestSellingProds)
  const [catWiseProducts, setCatWiseProducts] = useState(props.catWiseProducts)
  const { state } = useContext(DataContext)
  const { categories } = state

  useEffect(() => {
    setBsProducts(props.bestSellingProds)
    setCatWiseProducts(props.catWiseProducts);
  }, [props.catWiseProducts])

  return (
    <div className="home_page">
      <Head>
        <title>eCart - Home</title>
      </Head>

      <div className="carousel image img-fluid">
        <ControlledCarousel />
        <div className="bestSellCaroIndicators">
          <BestSellingProducts bsProducts={bsProducts} />
        </div>

      </div>
      <div className='row mt-5 m-3 pt-2 pb-3 card justify-content-center'>
        <ShopByCategories categories={categories} />
      </div>
      <div className='m-3'>
        <CategoryDisplayItems categories={categories} />
      </div>
      <div className='m-3'>
        <HomePageCards />
      </div>
      <div className='m-3'>
        <CategoryWiseProducts catWiseProducts={catWiseProducts}/>
      </div>
    </div>
  )
}


export async function getServerSideProps({ query }) {

  const bestSellingProds = await getData(`product?limit=10&category=all&sort=-sold&title=`)
  const catWiseProducts = await getData(`product?categoryWise=1&limit=10`)

  // server side rendering
  return {
    props: {
      bestSellingProds: bestSellingProds.products,
      catWiseProducts: catWiseProducts.products
    }, // will be passed to the page component as props
  }
}

export default Home