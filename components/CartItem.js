import Link from 'next/link'
import { decrease, increase } from '../store/Actions'
import { getData } from '../utils/fetchData'
import { calculatePrice } from '../utils/util'
import { DEFAULT_PROD_IMG, PRODUCT_API_ENDPOINT } from '../utils/constants'
import { DeleteIcon, MinusIcon, PlusIcon } from './Icons/Icon'
import { debounce } from 'lodash'

const currencyType = process.env.NEXT_PUBLIC_CURRENCY_TYPE === 'INR' ? '₹' : '$';

const plusProductCountClick = async (cart, itemId, quantity, dispatch) => {
    if (!itemId || !quantity) return;
    if (typeof itemId !== 'string' || typeof quantity !== 'number' || quantity < 0) {
        console.error('Invalid itemId or quantity provided.');
        return;
    }

    try {
        const res = await getData(`${PRODUCT_API_ENDPOINT}${itemId}?count=true`)
        if (res.error || typeof dispatch !== 'function' || typeof res.count !== 'number') return;
        if (res.count && quantity < res.count) dispatch(increase(cart, itemId));
    } catch (error) {
        console.error(`Error in plusProductCountClick:`, error);
    }
}

const CartItem = ({ item, dispatch, cart, isAdmin }) => {
    const handleDecrease = () => {
        dispatch(decrease(cart, item._id));
    };

    const handleIncrease = () => {
        plusProductCountClick(cart, item._id, item.quantity, dispatch);
    };

    const handleDelete = () => {
        dispatch({
            type: 'ADD_MODAL',
            payload: {
                data: cart,
                id: item._id,
                title: item.title,
                content: 'Do you want to delete this item?',
                type: 'ADD_CART'
            }
        });
    };

    return (
        <div className='card cart-item-card ms-sm-3 mx-2 mb-2'>
            <div className="row m-2">
                {/* Product Image */}
                <div className='col-1 cart-item-img-div'>
                    <Link href={`/product/${item._id}`}>
                        <img className="img-fluid rounded" src={item.url || DEFAULT_PROD_IMG} alt={item.title} />
                    </Link>
                </div>

                {/* Product Details */}
                <div className="col-5 mx-2">
                    <div>
                        <Link href={`/product/${item._id}`} className="text-capitalize product-title">
                            {item.title}
                        </Link>
                        <div className={`product-stock text-${item.inStock > 0 ? 'success' : 'danger'}`}>
                            {item.inStock > 0 ? `In Stock ${isAdmin ? `: ${item.inStock}` : ''}` : 'Out Of Stock'}
                        </div>
                    </div>
                </div>

                {/* Price and Quantity Controls */}
                <div className="col-4 cart-item-price-container align-self-end">
                    <div className="d-flex flex-column align-items-end">

                        {/* Price (One line) */}
                        <div className="text-end mb-2">
                            <span className='product-price-quantity'>{`${item.totalPrice} x ${item.quantity} = `}</span><span className='product-price'>{`${currencyType}${calculatePrice(item.quantity, item.totalPrice)}`}</span>
                        </div>

                        {/* Quantity Controls and Delete (Second line) */}
                        <div className="cart-item-controls d-flex justify-content-end align-items-center">
                            {/* Decrease Button */}
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => item.quantity === 1 ? handleDelete(item._id) : handleDecrease(item._id)}
                                data-bs-toggle={item.quantity === 1 ? "modal" : ""} data-bs-target="#confirmModal"
                            >
                                {item.quantity === 1 ? <DeleteIcon /> : <MinusIcon />}
                            </button>

                            {/* Quantity Display */}
                            <span className="product-quantity mx-2">{item.quantity}</span>

                            {/* Increase Button */}
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleIncrease(item._id)}
                            >
                                <PlusIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;