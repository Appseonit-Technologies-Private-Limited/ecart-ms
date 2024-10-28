import { useContext, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DataContext } from '../store/GlobalState'
import CartItem from '../components/CartItem'
import { getData, postData } from '../utils/fetchData'
import { isLoggedInPopup } from '../components/SignIn/SignInCardFunctionalComponent'
import { getAddressObj, validateAddress } from '../components/Cart/util'
import { isAdminRole, isLoading } from '../utils/util'
import { ADDRESS_EDIT, ERROR_403 } from '../utils/constants'
import EmptyCart from '../components/Cart/EmptyCart'
import TrustBadges from '../components/Home/TrustBadges'
import BackButton from '../components/Custom_Components/BackButton'
import { IoIosArrowForward } from "react-icons/io";
import { AddressFormPopup } from '../components/AddressForm/AddressFormPopup'

export async function getServerSideProps({ req }) {
  let addressData = [];
  let defaultAddress = {};
  // Fetch Addresses from the server
  if (req.cookies && req.cookies.com1) {
    const res = await getData('user/address', req.cookies.com1);
    if (res.addresses) {
      addressData = res.addresses;
      console.log('addressData: ', addressData);

      defaultAddress = addressData.find(address => address.default);
      console.log('defaultAddress : ', defaultAddress);

    }
  }

  // Pass data to the page via props
  return { props: { addressData: addressData, defaultAddress } };
}

const Cart = ({ defaultAddress }) => {
  const { state, dispatch } = useContext(DataContext)
  const { cart, auth, address } = state
  const [total, setTotal] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress)
  const [callback, setCallback] = useState(false)
  const router = useRouter()
  const isAdmin = auth && auth.user && isAdminRole(auth.user.role)

  useEffect(() => {
    if (address) {
      setSelectedAddress(address);
    }
  }, [address])

  // useEffect(() => {
  //   console.log('cart : ', cart);

  //   const getCart = async () => {
  //     if (cart) {
  //       const res = await postData('cart?type=GC', cart);
  //       if (res.status) return handleUIError(res.err, res.status, undefined, dispatch);
  //       else if (res.cart) {

  //       }
  //     }
  //   }

  //   getCart();
  // }, [])


  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + (item.totalPrice * item.quantity)
      }, 0)
      setTotal(Number(res).toFixed(2))
    }
    getTotal()
  }, [cart])

  useEffect(() => {
    if (cart && cart.length > 0) {
      let newArr = []
      const updateCart = async () => {
        for (const item of cart) {
          const res = await getData(`product/${item._id}?dp=1`);
          if (!res.err && res.product && res.product.inStock > 0) {
            newArr.push({ ...res.product, quantity: item.quantity > res.product.inStock ? res.product.inStock : item.quantity })
          }
        }
        dispatch({ type: 'ADD_CART', payload: newArr })
      }
      updateCart();
    }
  }, [callback])

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isLoggedInPopup(auth, dispatch)) return;
    if (isAdmin) return dispatch({ type: 'NOTIFY', payload: { error: ERROR_403 } })
    var shippingAddress = selectedAddress;
    if (shippingAddress && shippingAddress.new && shippingAddress.new === '-1') shippingAddress = getAddressObj(document.getElementById('addressForm'));
    const validateAddressMsg = validateAddress(shippingAddress);
    if (validateAddressMsg) return dispatch({ type: 'NOTIFY', payload: { error: validateAddressMsg } });

    let newCart = [];
    let nonAvailProducts = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}?count=true`)
      if (res.count && (res.count - item.quantity >= 0)) newCart.push(item);
      else nonAvailProducts.push(item.title);
    }

    if (newCart.length < cart.length) {
      setCallback(!callback)
      return dispatch({
        type: 'NOTIFY', payload: {
          error: `This Product(s) - [${nonAvailProducts.join(',')}] quantity is insufficient or out of stock.`
        }
      })
    }
    isLoading(true, dispatch);
    postData('order', { address: shippingAddress, cart, total }, auth.token)
      .then(res => {
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        if (res.newOrder) {
          return router.push(`/order?id=${res.newOrder._id}`)
        }
      })
  }

  if (cart.length === 0) return <EmptyCart />
  return (
    <>
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Cart`}</title>
      </Head>
      <BackButton />

      <div className="container-fluid cart">
        <h5>Review Your Cart <span className="cart-items"> - ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span></h5>
        <div className="row">
          <div className="col-md-7">
            {cart && cart.map((item, index) => (
              <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} isAdmin={isAdmin} />
            ))}
          </div>
          <div className="col-md-5">
            <div className="card p-3 mx-2 mx-sm-0 me-md-3">
              <h5>Order Summary</h5>
              <div class="my-4 cart-deliver-to-container d-flex align-items-center" onClick={() =>{AddressFormPopup(dispatch, {}, ADDRESS_EDIT, false)}} data-bs-toggle="modal" data-bs-target="#confirmModal">
                <div class="d-flex align-items-center">
                  <span class="deliver-to">Deliver to </span>
                  <div class="cart-deliver-address">
                    {selectedAddress && selectedAddress.fullName && selectedAddress.address ?
                      (<>
                        <span class="delivery-name">{`${selectedAddress.fullName} , `}</span>
                        <span class="delivery-location ps-1">{selectedAddress.address}, sHARJAH, uae</span>
                      </>)
                      : <span class="delivery-name">Please choose or enter address</span>
                    }
                  </div>
                </div>
                <div class="arrow-container">
                  <IoIosArrowForward />
                </div>
              </div>
              <h5 style={{ color: 'black' }}>Total: <span>₹{total}</span></h5>
              <Link href={'#!'} className="btn btn-primary my-2 cartPayBtn" onClick={handlePayment}>
                Proceed To Pay
              </Link>
            </div>
          </div>
        </div>
        <div className='m-4 m-sm-5'>
          <TrustBadges />
        </div>
      </div>
    </>
  )
}

export default Cart