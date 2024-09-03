import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DataContext } from '../store/GlobalState'
import { postData, putData } from '../utils/fetchData'
import { ACC_ACT_MAIL } from '../utils/constants.js'
import isEmpty from 'lodash/isEmpty';
import MenuNotifications from './Notifications/MenuNotifications'
import Dropdown from 'react-bootstrap/Dropdown';
import Menu from './Custom_Components/Menu.js'
import { CartIcon, NotificationIcon, AddProductIcon, ProductListIcon , UsersIcon, OrderHistoryIcon, UserIcon, CategoryIcon, LogoutIcon, DashboardIcon} from './Icons/Icon.js'

function NavBar() {
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth, cart, windowWidth } = state;
    const [accountActivated, setAccountActivated] = useState(auth && auth.user && auth.user.activated)
    const isAdmin = auth && auth.user && auth.user.role === 'admin';
    const mobileWidth = 576;

    const isActive = (r) => { return r === router.pathname ? " active" : "" }
    const handleLogout = async () => {
        const res = await putData(`auth/logout`, {}, auth.token)
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
        setAccountActivated(null)
        return router.push('/')
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
            <>
                {
                    isEmpty(auth)
                        ?
                        <Link href="/signin" className={"nav-link" + isActive('/signin')}>
                            <UserIcon />
                            <span className='navbar-menu-text'>Sign in</span>
                        </Link>

                        :
                        <Menu title={
                            <>
                                <UserIcon />
                                <span className='navbar-menu-text text-capitalize'>{auth.user.name}</span>

                            </>
                        }
                            menuItems={
                                <div>
                                    <Dropdown.Item href='/profile'>{<><UserIcon /> Profile</>}</Dropdown.Item>
                                    <Dropdown.Item href='/orders'>{<><OrderHistoryIcon /> Orders</>}</Dropdown.Item>
                                    {isAdmin && (
                                        <>
                                            <Dropdown.Item href='/users'>{<><UsersIcon/> Users</>}</Dropdown.Item>
                                            <Dropdown.Item href='/productList'>{<><ProductListIcon /> Product List</>}</Dropdown.Item>
                                            <Dropdown.Item href='/create'>{<><AddProductIcon /> Add Product</>}</Dropdown.Item>
                                            <Dropdown.Item href='/categories'>{<><CategoryIcon /> Categories</>}</Dropdown.Item>
                                        </>)
                                    }
                                    <Dropdown.Item href='/notifications'>{<><NotificationIcon/> Notifications</>}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>{<><LogoutIcon /> Logout</>}</Dropdown.Item>
                                </div>
                            }
                        />
                }
            </>
        )
    }

    return (
        <nav className="navbar navbar-expand fixed-top">
            <Link href="/">
                <div className="d-flex align-items-end" style={{ cursor: 'pointer' }}>

                    <h4 className='company-logo'>{process.env.NEXT_PUBLIC_APP_TITLE}</h4>
                    <div className='cart-logo'><CartIcon/></div>
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
                                <DashboardIcon />
                                {windowWidth && windowWidth > mobileWidth && <span className="navbar-menu-text"> Dashboard </span>}
                            </Link>
                        </li>

                    }
                    {
                        !isAdmin &&
                        <li className="nav-item">
                            <Link href="/cart" className={"nav-link" + isActive('/cart')}>
                            <CartIcon/>
                                {cart && cart.length > 0 && <span className="count-badge">{cart.length}</span>}
                                {windowWidth > mobileWidth && <span className='navbar-menu-text'>Cart</span>}
                            </Link>
                        </li>
                    }
                    <li className="nav-item"><MenuNotifications mobileWidth={mobileWidth} /></li>
                    <li className="nav-item"><MyAccount /> </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
