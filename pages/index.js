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
import CategoryWiseProducts from '../components/Home/CategoryWiseProducts'
import { Advertisements } from '../components/Home/Categories/Advertisements'

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
        <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Home`}</title>
      </Head>

      <div className="carousel image img-fluid">
        <ControlledCarousel />
        <div className="bestSellCaroIndicators">
          <BestSellingProducts bsProducts={bsProducts} />
        </div>

      </div>
      <div className='m-3'>
        <ShopByCategories categories={categories} />
      </div>
      <div className='m-3'>
        <Advertisements categories={categories} />
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