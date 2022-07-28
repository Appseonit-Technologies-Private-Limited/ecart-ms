import React, { useContext, useEffect, useState } from 'react'
import Menu from '../Custom_Components/Menu'
import Dropdown from 'react-bootstrap/Dropdown';
import { DataContext } from '../../store/GlobalState';
import { getAction, formatDateTime } from '../../utils/util';
import { isEmpty } from 'lodash';
import { getNotifications, updateCheckedNotifications } from '../../utils/NotificationHelper';

function MenuNotifications() {
    const { state, dispatch } = useContext(DataContext);
    const { auth, notifications } = state;
    const [notificationsArr, setNotificationsArr] = useState()

    useEffect(() => {
        if (!isEmpty(auth.token)) {
            setInterval(() => {
                getNotifications(auth, dispatch);
            }, 10000);
        }
    }, [auth.token])

    useEffect(() => {
        if (!isEmpty(notifications)) {
            setNotificationsArr(notifications)
        }
    }, [notifications])

    const NotificationList = () => {
        return (
            <>
                {notificationsArr && notificationsArr.length > 0 ?
                    notificationsArr.map((item, i) => (
                        i < 3 &&
                        (
                            <div className="menu-item" key={i}>
                                <Dropdown.Item href={getAction(item.action)} onClick={() => { updateCheckedNotifications(item._id, notificationsArr, auth, dispatch) }}>
                                    <div style={{ whiteSpace: 'break-spaces' }}>
                                        {item.createdAt &&
                                            <span style={{ fontSize: 'x-small', fontWeight: 'bold' }}>
                                                {formatDateTime(item.createdAt)}
                                            </span>
                                        }
                                        {item.notification &&
                                            <div className={`text-${item.type}`}>
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
            <Menu title=
                {
                    <>
                        <i className="fas fa-bell" aria-hidden="true" >
                            {(notificationsArr && notificationsArr.length) > 0 ?
                                <>
                                    <span className="count-badge count-badge-notification">
                                        {(notificationsArr && notificationsArr.length)}
                                    </span>
                                    <span className="navbar-menu-text" style={{ paddingLeft: (notificationsArr && notificationsArr.length) > 9 ? '25px' : '20px' }}>Notifications</span>
                                </>
                                :
                                <span className="navbar-menu-text">Notifications</span>
                            }
                        </i>
                    </>
                }
                menuItems={<NotificationList />}
            />
        </>
    )
}

export default MenuNotifications