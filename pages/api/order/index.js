import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import Products from '../../../models/productModel'
import Notifications from '../../../models/notificationsModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, NORMAL, ADMIN_ROLE, USER_ROLE, ORDER_DETAIL } from '../../../utils/constants'
import { notUserRole, formatDateTime } from '../../../utils/util'

connectDB()

/*
    POST     - Protected
    GET      - Protected
    PATCH    - Protected
*/

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            if (req.body.type === 'GET') await getOrders(req, res)
            else await createOrder(req, res)
            break;
        case "GET":
            await getOrders(req, res)
            break;
        case "PATCH":
            await updateOrderPlaced(req, res)
            break;
    }
}

const getOrders = async (req, res) => {
    try {
        const result = await auth(req, res)

        let orders;
        const { dateRange } = req.body;

        let filter = {};
        if (dateRange) filter = { ...filter, createdAt: { $gte: dateRange[0].startDate, $lt: dateRange[0].endDate } }

        if (result.role === USER_ROLE) {
            orders = await Orders.find({ user: result.id, ...filter }).populate({ path: "user", select: "name email -_id" }).sort({ createdAt: -1 })
        } else if (result.role === ADMIN_ROLE) {
            orders = await Orders.find(filter).populate("user", "-password").sort({ createdAt: -1 })
        } else {
            return res.status(403).json({ err: ERROR_403 });
        }
        res.json({ orders })
    } catch (err) {
        console.error('Error occurred while getOrders: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const createOrder = async (req, res) => {
    console.log('Creating Order ....')
    try {
        const result = await auth(req, res)
        const { address, cart, total } = req.body

        if (notUserRole(result.role)) return res.status(403).json({ err: ERROR_403 });

        for (let i = 0; i < cart.length; i++) { await sold(cart, i) }

        const newOrder = await new Orders({ user: result.id, address, cart, total }).save();
        notifyAdminForNewOrder(newOrder._id, result.id);
        res.json({
            msg: 'Order placed! You will be notified once order is accepted.',
            newOrder
        });

    } catch (err) {
        console.error('Error occurred while createOrder: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const sold = async (cart, index) => {

    let oldCartItem = cart[index];
    const updatedStock = oldCartItem.inStock - oldCartItem.quantity;
    const updatedSold = oldCartItem.quantity + oldCartItem.sold;
    oldCartItem.inStock = updatedStock;
    oldCartItem.sold = updatedSold;
    cart[index] = oldCartItem;
    await Products.findOneAndUpdate({ _id: oldCartItem._id }, { inStock: updatedStock, sold: updatedSold })
}

const updateOrderPlaced = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (notUserRole(result.role)) return res.status(403).json({ err: ERROR_403 });

        const { id, method } = req.body
        const data = { placed: true, dateOfPlaced: formatDateTime(new Date()), method: method }
        await Orders.findOneAndUpdate({ _id: id }, data)

        res.json({
            msg: 'Order placed successfully!',
            result: {
                placed: true,
                dateOfPlaced: formatDateTime(new Date()),
                method: method
            }
        })
    } catch (err) {
        console.error('Error occurred while updateOrderPlaced: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const notifyAdminForNewOrder = (orderId, userId) => {
    try {
        new Notifications(
            {
                notification: `A new order placed. Please acknowledge it immediately.`,
                severity: NORMAL,
                action: { type: ORDER_DETAIL, data: { orderId } },
                user: userId,
                role: ADMIN_ROLE
            }
        ).save();
    } catch (err) {
        console.error('Error occurred while notifyAdminForNewOrder: ' + err);
    }
}