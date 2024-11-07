import Head from 'next/head'
import { getData, putData } from '../utils/fetchData';
import { useContext, useEffect, useState } from 'react';
import Address from '../components/Cart/Address';
import { DataContext } from '../store/GlobalState';
import { useMediaQuery } from 'react-responsive';
import { MOBILE_WIDTH, TABLET_WIDTH } from '../utils/constants';
import { log_info } from '../middleware/log';
import { AddressIcon, LogoutIcon, NotificationIcon, OrderHistoryIcon, ReturnBoxIcon, SecurePayIcon, WishListIcon } from '../components/Icons/Icon';
import { dispatch } from 'd3';
import { useRouter } from 'next/router';
import MenuNotifications from '../components/Notifications/MenuNotifications';
import Notifications from '../components/Notifications/Notifications';
import Orders from '../components/Orders/Orders';
import BackButton from '../components/Custom_Components/BackButton';

export async function getServerSideProps({ req }) {
    let addressData = [];
    log_info("Populating profile data...");

    if (req.cookies && req.cookies.com1) {
        const res = await getData('user/address', req.cookies.com1);
        if (res.addresses) {
            addressData = res.addresses;
            log_info('Profile addressData: ', addressData);
        }
    }

    // Pass data to the page via props
    return { props: { addressData: addressData } };
}

const Profile = ({ addressData }) => {

    const { state, dispatch } = useContext(DataContext);
    const router = useRouter();
    const { auth } = state
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('')
    const [activemenu, setActivemenu] = useState('Addresses');
    const isMobile = useMediaQuery({ maxWidth: MOBILE_WIDTH + 1 });
    const [showMenu, setShowMenu] = useState(true);

    const profileMenus = [
        { id: 'Orders', icon: <OrderHistoryIcon />, label: 'Orders' },
        { id: 'Wishlist', icon: <WishListIcon />, label: 'Wishlist' },
        { id: 'Addresses', icon: <AddressIcon />, label: 'Addresses' },
        { id: 'Payments', icon: <SecurePayIcon />, label: 'Payments' },
        { id: 'Returns', icon: <ReturnBoxIcon />, label: 'Returns' },
        { id: 'Notifications', icon: <NotificationIcon />, label: 'Notifications' },
        { id: 'Logout', icon: <LogoutIcon />, label: 'Logout' }
    ];


    useEffect(() => {
        if (auth && auth.user) {
            setUserName(auth.user.name);
            setEmail(auth.user.email);
        }
    }, [auth])


    const renderContent = () => {

        switch (activemenu) {
            case 'Orders':
                return <Orders />;
            case 'Wishlist':
            case 'Addresses':
                return (
                    <>
                        <h5>Addresses</h5>
                        <Address addressData={addressData} isProfilePage></Address>
                    </>
                );
            case 'Notifications':
                return <Notifications />;
            default:
                return (
                    <><h5>{activemenu}</h5><div className='d-flex justify-content-center'><p className='text-muted'>"Currently under development! Please check back soon."</p></div></>);
        }
    }

    const handleLogout = async () => {
        const res = await putData(`auth/logout`, {}, auth.token)
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
        return router.push('/')
    }

    const handleMenuClick = (menuId) => {
        log_info('Menu clicked : ' + menuId);

        if (isMobile) setShowMenu(false)

        setActivemenu(menuId);
    }

    return (
        <div className='container-fluid'>
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Profile`}</title>
            </Head>

            <div className='row'>
                {(!isMobile || showMenu) &&
                    <div className='col col-sm-3 m-3 me-sm-0 profile-menu'>
                        <div className='pt-4 px-3'>
                            <h5 className='text-capitalize'>{`Hello ${userName && userName}!`}</h5>
                            <h6 className="text-muted">{email && email}</h6>
                            <button className="w-100 mb-3 btn btn-outline-primary"
                                onClick={() => { alert(`We're working on it, please contact Admin! `) }}>
                                Join Premium
                            </button>
                        </div>
                        <nav className="profile-nav">
                            {profileMenus.map((menu) => (
                                <button
                                    key={menu.id}
                                    className={`nav-item nav-item${activemenu === menu.id ? '-active' : ''}`}
                                    onClick={() => { menu.id === 'Logout' ? handleLogout() : handleMenuClick(menu.id) }}
                                >
                                    <span className="icon">{menu.icon}</span> <span className='label'>{menu.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                }
                {isMobile && !showMenu && <BackButton cb={() => setShowMenu(true)} />}
                {(!isMobile || !showMenu) &&
                    <div className='col-11 col-sm-8 m-3 mt-0 mt-sm-3 me-0 p-4 profile-menu-body'>
                        {renderContent()}
                    </div>
                }
            </div>
        </div>
    );
}

export default Profile;