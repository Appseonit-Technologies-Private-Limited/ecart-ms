import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DataContext } from '../store/GlobalState'
import { postData, putData } from '../utils/fetchData'
import Cookie from 'js-cookie'
import { ACC_ACT_MAIL } from '../utils/constants.js'
import isEmpty from 'lodash/isEmpty';
import MenuNotifications from './Notifications/MenuNotifications'

function NavBar() {
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth, cart } = state;
    const [windowWidth, setWindowWidth] = useState(300);
     
    const [accountActivated, setAccountActivated] = useState(auth && auth.user && auth.user.activated)
    const isAdmin = auth && auth.user && auth.user.role === 'admin';

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [])
    
    const isActive = (r) => { return r === router.pathname ? " active" : "" }
    const handleLogout = async () => {
        const res = await putData(`auth/logout`, {}, auth.token)
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
        setAccountActivated(null)
        return router.push('/')
    }

    const adminRouter = () => {
        return (
            <>
                <Link href="/users" className="dropdown-item">Users
                </Link>
                <Link href="/productList" className="dropdown-item">
                    Product List
                </Link>
                <Link href="/create" className="dropdown-item">Add Product
                </Link>
                <Link href="/categories" className="dropdown-item">Categories
                </Link>
            </>
        )
    }

    useEffect(() => {
        if (auth && auth.user && !auth.user.activated) {
            setAccountActivated(false)
        }
    }, [auth])

    const triggerAccountActivationMail = () => {
        if (auth && auth.user && auth.user.email) {
            postData('mail', { userName: auth.user.name, email: auth.user.email, id: auth.user.id, mailType: ACC_ACT_MAIL, subject: 'Account Activation Request' }, auth.token)
            dispatch({ type: 'NOTIFY', payload: { success: "An activation link has been sent to your registered mail address, please activate your account for full access.", delay: 12000 } })
        }
    }

    const MyAccount = () => {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img className="menu-my-account-pic" src={auth.user.avatar} alt={auth.user.avatar} />
                    <span className="navbar-menu-text menu-my-account-text">{auth.user.name}</span>
                </a>

                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link href="/profile" className="dropdown-item">Profile
                    </Link>
                    {
                        auth.user.role === 'admin' && adminRouter()
                    }
                    <Link href="/orders" className="dropdown-item">Orders
                    </Link>
                    <Link href="/notifications" className="dropdown-item">Notifications
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
            </li>
        )
    }

    return (
        <nav className="navbar navbar-expand fixed-top">
            <Link href="/">
                <div className="d-flex align-items-end mb-0" style={{ cursor: 'pointer' }}>
                    {/* <img src="/assets/images/icon/KFM_Logo_Small_Black.svg" alt="KFM Enterprises" /> */}
                    <h4 className='company-logo'>eCART</h4>
                    <i className="fas fa-shopping-cart position-relative cart-logo" aria-hidden="true"></i>
                </div>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                {accountActivated === false &&
                    <button onClick={() => { triggerAccountActivationMail() }} className="btn btn-warning activateBtn">Activate Your Account</button>
                }

                <ul className="navbar-nav">
                    {/* <li className="nav-item" >
                        <Link href="/" className={"nav-link" + isActive('/')}>
                            <i className="fas fa-home" aria-hidden="true" ></i> 
                            <span className='navbar-menu-text'>Home</span>
                        </Link>
                    </li> */}
                    {isAdmin &&
                        <li className="nav-item" >
                            <Link href="/dashboard" className={"nav-link" + isActive('/dashboard')}>
                                <i className="fas fa-th" aria-hidden="true" ></i>
                                {windowWidth && windowWidth > 576 && <span className="navbar-menu-text"> Dashboard </span>}
                            </Link>
                        </li>

                    }

                    {
                        !isAdmin &&
                                    <li className="nav-item">
                                        <Link href="/cart" className={"nav-link" + isActive('/cart')}>
                                            <i className="fas fa-shopping-cart" aria-hidden="true" > 
                                                {cart && cart.length > 0 && <span className="count-badge count-badge-cart">{cart.length}</span>}
                                                {windowWidth && windowWidth > 576 && <span className="navbar-menu-text" style={{ paddingLeft:  windowWidth > 576 && !(cart && cart.length) ? '5px' : cart && cart.length > 9 ? '25px' : '20px' }}>Cart</span>}       
                                            </i>
                                        </Link>
                                    </li>
                    }

                    <li className="nav-item" >
                        <MenuNotifications windowWidth={windowWidth}/>
                    </li>
                    {
                        isEmpty(auth)
                            ? <li className="nav-item">
                                <Link href="/signin" className={"nav-link" + isActive('/signin')}>
                                    <i className="fas fa-user" aria-hidden="true"></i>
                                    <span className='navbar-menu-text'>Sign in</span>
                                </Link>
                            </li>
                            : MyAccount()
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
