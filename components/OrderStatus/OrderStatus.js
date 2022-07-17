import { patchData, postData } from '../../utils/fetchData'
import { CONTACT_ADMIN_ERR_MSG, ORDER_CONFIRMATION_MAIL, ORDER_DELIVERED_MAIL } from '../../utils/constants'
import { formatDateTime } from '../../utils/util'
import { useState } from 'react';




const OrderStatus = (props) => {


    const [order, setorder] = useState(props.order);

    const handleAccept = (order) => {
        //Upating the db with accept response from th admin.
        try {
            props.dispatch({ type: 'NOTIFY', payload: { loading: true } })
            patchData(`order/accept/${order._id}`, null, props.auth.token)
                .then(res => {
                    if (res.err) return props.dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                    const { accepted, dateOfAccept } = res.result;

                    setorder({ ...order, accepted, dateOfAccept });
                    return props.dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                })
            const userData = {
                userName: order.user.name,
                email: order.user.email,
                mailType: ORDER_CONFIRMATION_MAIL,
                subject: `Order ID: ${order._id} accepted by seller`,
                orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order?id=${order._id}`,
            }
            postData('mail', userData, props.auth.token)
        } catch (err) {
            props.dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const handleDelivered = (order) => {
        props.dispatch({ type: 'NOTIFY', payload: { loading: true } })

        patchData(`order/delivered/${order._id}`, null, props.auth.token)
            .then(res => {
                if (res.err) return props.dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                const { delivered, paid, dateOfPayment } = res.result;
                setorder({ ...order, delivered, paid, dateOfPayment });
                return props.dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
        const userData = {
            userName: order.user.name,
            mailType: ORDER_DELIVERED_MAIL,
            subject: 'Order Delivered.',
            email: order.user.email,
            orderId: order._id,
            orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order?id=${order._id}`,
        }
        postData('mail', userData, props.auth.token)
    }

    return (
        <div className="main_container">
            <div className="card-body">
                <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">

                    <div className={order.accepted ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap">
                                <div className="step-icon"> {order.accepted ? <img src="../assets/images/icon/shopping-cart-white-10925.svg" className="cartIcon" /> : <img src="../assets/images/icon/shopping-cart-10925.svg" className="cartIcon" />} </div>
                            </div>
                            <div className="label-align">
                                <h4 className={order.accepted ? 'step-title-after' : 'step-title-await-before'}>
                                    {
                                        order.accepted ?
                                            `Order Confirmed on ${formatDateTime(new Date())}`
                                            :
                                            (props.auth.user.role === 'admin' ? 'Order Placed' : 'Awaiting Confirmation')
                                    }
                                </h4>
                                {
                                    props.auth.user.role === 'admin' && !order.accepted &&
                                    <button className="btn btn-dark text-uppercase order-handle-button"
                                        onClick={() => handleAccept(order)}>
                                        Accept Order
                                    </button>
                                }
                            </div>
                        </div>
                    </div>

                    <div className={order.accepted ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap ">
                                <div className="step-icon">{order.accepted ? <img src="../assets/images/icon/settings-white-5671.svg" className="cartIcon" /> : <img src="../assets/images/icon/settings-5670.svg" className="cartIcon" />} </div>
                            </div>
                            <div className="label-align">
                                <h4 className={order.accepted ? 'step-title-after' : 'step-title-before'}>{order.delivered ? 'Order Processed' : 'Processing Order'}</h4>
                            </div>
                        </div>
                    </div>

                    <div className={order.delivered ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap ">
                                <div className="step-icon">{order.delivered ? <img src="../assets/images/icon/delivery.svg" className="cartIcon" /> : <img src="../assets/images/icon/delivery-white.svg" className="cartIcon" />}</div>
                            </div>

                            <div className="label-align">
                                <h4 className={order.delivered ? 'step-title-after' : 'step-title-before'}>
                                    {
                                        order.delivered ? 'Product Delivered' : 'In Transit'
                                    }
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className={order.delivered ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap ">
                                <div className="step-icon">{order.delivered ? <img src="../assets/images/icon/home-white.svg" className="cartIcon" /> : <img src="../assets/images/icon/home.svg" className="cartIcon" />}</div>
                            </div>

                            <div className="label-align">
                                <h4 className={order.delivered ? 'step-title-after' : 'step-title-before'}>
                                    {
                                        order.delivered ? `Delivered on ${formatDateTime(new Date(props.payType === 'cod' ? order.dateOfPayment : order.dateOfAccept))}` : 'Not Yet Delivered'
                                    }
                                </h4>
                                {
                                    props.auth.user.role === 'admin' && !order.delivered &&
                                    <button className="btn btn-dark text-uppercase order-handle-button"
                                        disabled={order.accepted ? false : true}
                                        onClick={() => handleDelivered(order)} >
                                        Mark As Delivered
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OrderStatus