import Link from 'next/link'
import { useContext } from 'react'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import Image from 'next/image'

const ProductCard = ({ product, handleCheck, viewOnly }) => {
    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state
    const isAdmin = auth && auth.user && auth.user.role === 'admin'
    const currencyType = process.env.NEXT_PUBLIC_RAZORPAY_CURRENCY === 'INR' ? '₹' : '$';

    const dispatchAddToCart = () => {
        const res = addToCart(product, cart);
        dispatch(res)
        if (res.type === "ADD_CART") dispatch({ type: 'NOTIFY', payload: { success: 'Product is added to cart.' } })
    }

    return (
        <div className="">
            {
                (isAdmin && !viewOnly) &&
                <input type="checkbox" checked={product.checked}
                    className="position-absolute"
                    style={{ height: '20px', width: '20px' }}
                    onChange={() => handleCheck(product._id)} />
            }
            <Link href={`/product/${product._id}`}>
                <div className='img-container'>
                    <Image src={product.url} alt={product.title} width={200} height={200}/>
                    {product.discount !== '0.0' && <span className="offer-tag">{product.discount}% OFF</span>}
                </div>
            </Link>
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
                            </label>
                        </div>
                        <div className="add-btn-container">
                            {product.inStock > 0 ?
                                <button
                                    className="btn btn-primary"
                                    disabled={product.inStock === 0 || isAdmin}
                                    onClick={dispatchAddToCart}
                                >
                                <span className='icon'><MdOutlineAddShoppingCart  /></span>
                                </button>
                                :
                                <label className='out-of-stock'>Out of Stock</label>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ProductCard