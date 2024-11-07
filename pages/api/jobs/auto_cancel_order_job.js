import { log_debug, log_error } from "../../../middleware/log";
import { deleteData, putData } from "../../../utils/fetchData";

export const autoCancelOrder = async (order, authToken) => {
    try {
        log_debug('autoCancelOrder...');
        log_debug('autoCancelOrder Process Start...');
        deleteData(`order/${order._id}`, authToken)
            .then(res => {
                if (res.err) throw err;
                if (res.order && !res.order.placed) {
                    log_debug('No payment done for order : ' + res.order._id);
                    revertingInStockAndSoldOfProduct(res.order);
                    log_debug('autoCancelOrder Job completed!');
                }
            });
    } catch (err) { log_error('autoCancelOrder', err) }
}

const revertingInStockAndSoldOfProduct = async (order, authToken) => {
    try {
        order.cart.map(product => {
            log_debug('Reverting Instock and Sold count for : ' + product.title)
            const sold = product.sold - product.quantity;
            const inStock = product.inStock + product.quantity;
            putData(`product/${product._id}`, { updateStockAndSold: true, sold, inStock }, authToken)
                .then(res => { if (res.err) throw err })
        })
    } catch (err) { log_error('revertingInStockAndSoldOfProduct', err) }
}