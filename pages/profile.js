import Head from 'next/head'
import { getData } from '../utils/fetchData';
import { useContext, useEffect, useState } from 'react';
import Address from '../components/Cart/Address';
import { DataContext } from '../store/GlobalState';
import { useMediaQuery } from 'react-responsive';
import { MOBILE_WIDTH, TABLET_WIDTH } from '../utils/constants';


export async function getServerSideProps({ req }) {
    let addressData = [];
    console.log("Populating profile data...");

    if (req.cookies && req.cookies.com1) {
        const res = await getData('user/address', req.cookies.com1);
        if (res.addresses) {
            addressData = res.addresses;
            console.log('Profile addressData: ', addressData);
        }
    }

    // Pass data to the page via props
    return { props: { addressData: addressData } };
}

const Profile = ({ addressData }) => {

    const { state } = useContext(DataContext)
    const { auth } = state
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('')
    const [activemenu, setActivemenu] = useState('Addresses');
    const isMobile = useMediaQuery({ maxWidth: MOBILE_WIDTH + 1 });

    const profileMenus = [
        { id: 'Wishlist', icon: '❤️', label: 'Wishlist' },
        { id: 'Orders', icon: '📋', label: 'Orders' },
        { id: 'Returns', icon: '↩️', label: 'Returns' },
        { id: 'Addresses', icon: '📍', label: 'Addresses' },
        { id: 'Payments', icon: '💳', label: 'Payments' }
    ];


    useEffect(() => {
        if (auth && auth.user) {
            setUserName(auth.user.name);
            setEmail(auth.user.email);
        }
    }, [auth])


    const renderContent = () => {

        switch (activemenu) {
            case 'Addresses':
                return (<Address addressData={addressData} isProfilePage></Address>);
            default:
                return <p>{activemenu}</p>;
        }
    }

    return (
        <div className='container-fluid'>
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_TITLE} - Profile`}</title>
            </Head>
            <div className='row'>
                <div className='col col-sm-4 m-3 profile-menu'>
                    <div className='pt-4 px-3'>
                        <h4 className='text-capitalize'>{`Hello ${userName && userName}!`}</h4>
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
                                onClick={() => setActivemenu(menu.id)}
                            >
                                <span className="icon">{menu.icon}</span> {menu.label}
                            </button>
                        ))}
                    </nav>
                </div>
                {!isMobile &&
                    <div className='col m-3 p-4 profile-menu-body'>
                        {renderContent()}
                    </div>
                }
            </div>
        </div>
    );
}

export default Profile;