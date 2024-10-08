import React, { useContext, useEffect, useState } from 'react'
import Menu from '../Custom_Components/Menu'
import Dropdown from 'react-bootstrap/Dropdown';
import { DataContext } from '../../store/GlobalState';
import { getAction, formatDateTime } from '../../utils/util';
import { isEmpty } from 'lodash';
import { updateCheckedNotifications } from '../../utils/NotificationHelper';
import { getData } from '../../utils/fetchData';
import { NotificationIcon } from '../Icons/Icon';

function MenuNotifications({isMobile, isActivePath}) {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const [notificationsArr, setNotificationsArr] = useState([])

    useEffect(() => {
        if (!isEmpty(auth.token)) {
            // setInterval(() => {
            //     getData('notifications', auth.token)
            //         .then(res => {
            //             if (res.status) return handleUIError(res.err, res.status, auth, dispatch);
            //             if (!isEmpty(res.notifications)) setNotificationsArr(res.notifications)
            //         })
            // }, 10000);
        }
    }, [auth.token])


    const NotificationList = () => {
        return (
            <>
                {notificationsArr && notificationsArr.length > 0 ?
                    notificationsArr.map((item, i) => (
                        i < 3 &&
                        (
                            <div className="menu-item pb-0" key={i}>
                                <Dropdown.Item href={getAction(item.action)} onClick={() => { updateCheckedNotifications(item._id, notificationsArr, auth, dispatch) }}>
                                    <div style={{ whiteSpace: 'break-spaces' }}>
                                        {item.createdAt &&
                                            <span style={{ fontSize: 'x-small', fontWeight: 'bold' }}>
                                                {formatDateTime(item.createdAt)}
                                            </span>
                                        }
                                        {item.notification &&
                                            <div className={`text-${item.type}`} style={{ fontSize: 'small' }}>
                                                {item.notification}
                                            </div>
                                        }
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Divider />
                            </div>
                        )
                    ))
                    :
                    <div style={{ fontSize: 'small', padding: '6px', textAlign: 'center', color: 'grey' }}>{'No new notifications yet.'}</div>
                }
                {(notificationsArr && notificationsArr.length > 3) &&
                    <div style={{ textAlign: 'center' }}><a style={{ textDecoration: 'none' }} href='notifications'>
                        Load More
                    </a></div>
                }
            </>
        )
    }
    return (
        <>
            <Menu 
                title= {
                    <div className="nav-icon-text">
                        <NotificationIcon />
                        {notificationsArr && notificationsArr.length > 0 && <span className="count-badge"> {(notificationsArr && notificationsArr.length)}</span>}                       
                        {<span className="navbar-menu-text ml-1">Notifications</span> }  
                   </div>
                }
                menuItems={<NotificationList />}
            />
        </>
    )
}

export default MenuNotifications