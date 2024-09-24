import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import { ACC_ACT_MAIL, MOBILE_MAX_WIDTH } from '../utils/constants.js'
import MenuNotifications from './Notifications/MenuNotifications'
import { CartLogoIcon, CartIcon, DashboardIcon, HomeIcon } from './Icons/Icon.js'
import { useMediaQuery } from 'react-responsive'
import { isAdminRole } from '../utils/util.js'
import MyAccount from './MyAccount/MyAccount.js'
import ProductSearchBar from './ProductSearchBar/ProductSearchBar.js'
import Logo from './Logo/Logo.js'

function NavBar() {
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth, cart } = state;
    const isAdmin = isAdminRole(auth && auth.user && auth.user.role);
    const isMobile = useMediaQuery({ maxWidth: MOBILE_MAX_WIDTH });


    const isActivePath = (r) => { return r === router.pathname ? " active" : "" }

    const triggerAccountActivationMail = () => {
        if (auth && auth.user && auth.user.email) {
            postData('mail', { userName: auth.user.name, email: auth.user.email, id: auth.user.id, mailType: ACC_ACT_MAIL, subject: 'Account Activation Request' }, auth.token)
            dispatch({ type: 'NOTIFY', payload: { success: "An activation link has been sent to your registered mail address, please activate your account for full access.", delay: 12000 } })
        }
    }

    return (
        <>
            {isMobile && (
                <>
                    <nav className={`navbar navbar-expand fixed-top`}>
                        <Logo isMobile={isMobile} />
                        <div className='d-flex justify-content-center flex-grow-1 px-5'><ProductSearchBar /></div>
                    </nav>
                </>
            )}
            <nav className={`navbar navbar-expand ${isMobile ? 'fixed-bottom' : 'fixed-top'}`}>
                {!isMobile && <Logo isMobile={isMobile} />}

                {!isMobile && <div className='d-flex justify-content-center flex-grow-1 px-5'><ProductSearchBar /></div>}

                {auth && auth.user && !auth.user.activated &&
                    <button onClick={() => { triggerAccountActivationMail() }} className="btn btn-warning activateBtn">Activate Your Account</button>
                }
                <div className="navbar-menu-btns-container">
                    <ul className="navbar-nav">
                        {isMobile && <li className="nav-item" >
                            <Link href="/" className={"nav-link" + isActivePath('/')}>
                                <div className="nav-icon-text">
                                    <HomeIcon />
                                    {<span className="navbar-menu-text"> Home </span>}
                                </div>
                            </Link>

                        </li>}

                        {isAdmin &&
                            <li className="nav-item" >
                                <Link href="/dashboard" className={"nav-link" + isActivePath('/dashboard')}>
                                    <DashboardIcon />
                                    {<span className="navbar-menu-text"> Dashboard </span>}
                                </Link>
                            </li>

                        }
                        {
                            !isAdmin &&
                            <li className="nav-item">
                                <Link href="/cart" className={"nav-link" + isActivePath('/cart')}>
                                    <div className="nav-icon-text">
                                        <CartIcon />
                                        {cart && cart.length > 0 && <span className="count-badge">{cart.length}</span>}
                                        {<span className='navbar-menu-text'> Cart </span>}

                                    </div>
                                </Link>
                            </li>
                        }
                        <li className="nav-item"><MenuNotifications isMobile={isMobile} isActivePath={isActivePath} /></li>
                        <li className="nav-item"><MyAccount isAdmin={isAdmin} isMobile={isMobile} isActivePath={isActivePath} /></li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default NavBar
