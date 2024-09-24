import React, { useContext } from 'react'
import { DataContext } from '../../store/GlobalState';
import Link from 'next/link';
import Menu from '../Custom_Components/Menu';
import Dropdown from 'react-bootstrap/Dropdown';
import { NotificationIcon, AddProductIcon, ProductListIcon, UsersIcon, OrderHistoryIcon, UserIcon, CategoryIcon, LogoutIcon } from '../Icons/Icon.js'
import { putData } from '../../utils/fetchData.js';
import { useRouter } from 'next/router.js';

function MyAccount({ isAdmin, isMobile, isActivePath }) {

    const { state, dispatch } = useContext(DataContext);
    const router = useRouter()
    const { auth } = state;


    const handleLogout = async () => {
        const res = await putData(`auth/logout`, {}, auth.token)
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
        return router.push('/')
    }

    return (
        <>
            {
                (!auth || !auth.user || !auth.user.name)
                    ?

                    <Link href="/signin" className={"nav-link" + isActivePath('/signin')}>
                        <div className="nav-icon-text">
                            <UserIcon />
                            <span className='navbar-menu-text'>Sign in</span>
                        </div>
                    </Link>
                    :
                    <Menu title={
                        <div className="nav-icon-text">
                            <UserIcon />
                            {<span className='navbar-menu-text text-capitalize'>{auth.user.name}</span>}
                        </div>
                    }
                        menuItems={
                            <div>
                                <Dropdown.Item href='/profile'>{<><UserIcon /> Profile</>}</Dropdown.Item>
                                <Dropdown.Item href='/orders'>{<><OrderHistoryIcon /> Orders</>}</Dropdown.Item>
                                {isAdmin && (
                                    <>
                                        <Dropdown.Item href='/users'>{<><UsersIcon /> Users</>}</Dropdown.Item>
                                        <Dropdown.Item href='/productList'>{<><ProductListIcon /> Product List</>}</Dropdown.Item>
                                        <Dropdown.Item href='/create'>{<><AddProductIcon /> Add Product</>}</Dropdown.Item>
                                        <Dropdown.Item href='/categories'>{<><CategoryIcon /> Categories</>}</Dropdown.Item>
                                    </>)
                                }
                                <Dropdown.Item href='/notifications'>{<><NotificationIcon /> Notifications</>}</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>{<><LogoutIcon /> Logout</>}</Dropdown.Item>
                            </div>
                        }
                    />
            }
        </>
    )
}

export default MyAccount