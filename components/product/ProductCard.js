import Link from 'next/link'
import { useContext } from 'react'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'
import Image from 'next/image'
import { DEFAULT_PROD_IMG } from '../../utils/constants'
import { AddCartIcon } from '../Icons/Icon'

const ProductCard = ({ product, handleCheck, viewOnly }) => {
    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state
    const isAdmin = auth && auth.user && auth.user.role === 'admin'
    const currencyType = process.env.NEXT_PUBLIC_CURRENCY_TYPE === 'INR' ? '₹' : '$';

    const dispatchAddToCart = () => {
        const res = addToCart(product, cart);
        dispatch(res)
        if (res.type === "ADD_CART") dispatch({ type: 'NOTIFY', payload: { success: 'Item added to your cart!' } })
    }

    return (
        <>
            {/* {
                (isAdmin && !viewOnly) &&
                <input type="checkbox" checked={product.checked}
                    className="position-absolute"
                    style={{ height: '20px', width: '20px' }}
                    onChange={() => handleCheck(product._id)} />
            } */}
            <Link href={`/product/${product._id}`}>
                <div className='img-container'>
                    <Image src={product.url || DEFAULT_PROD_IMG} alt={product.title} width={200} height={200}/>
                </div>
            </Link>
            <span className="add-btn-container">
                {product.inStock > 0 ?
                    <button className="btn btn-primary" disabled={product.inStock === 0 || isAdmin} onClick={dispatchAddToCart}>
                        <span className='icon'><AddCartIcon /></span>
                    </button>
                    :
                    <label className='out-of-stock'>Out of Stock</label>
                }
            </span>
            <div className="card-body">
                <div className="d-flex flex-column">
                    <div className="title-container">
                        <label className="card-title text-capitalize">{product.title}</label>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="price-container">
                            <label className="price">
                                {`${currencyType}${product.totalPrice}`}
                                {product.discount !== '0.0' && <span className="mrp-price">{`${currencyType}${product.mrpPrice}`}</span>}
                                {product.discount !== '0.0' && <span className="offer-tag">{product.discount}%</span>}
                            </label>
                        </div>
                       
                    </div>
                </div>
            </div>
        </>
    )
}


export default ProductCard