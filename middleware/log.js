import { formatDateTime } from "../utils/util";


export const log_info = (msg, object) => {
    if(process.env.NODE_ENV !== 'production' && object !== undefined) {
        console.log(object);
    }
    return console.log(` ${formatDateTime(new Date(), 'LTS ll')} : [INFO] - ${msg} ${object !== undefined ? '-' + JSON.stringify(object) : ''}`);
}

export const log_debug = (msg, object) => {
    if (process.env.SHOW_DEBUG_LOG) {
        return console.log(` ${formatDateTime(new Date(), 'LTS ll')} : [DEBUG] - ${msg} ${object !== undefined ? '-' + JSON.stringify(object) : ''}`);
    } else return;
}

export const log_error = (methodName, err) => {
    return console.error(` ${formatDateTime(new Date(), 'LTS ll')} : [ERROR] - ${methodName} : ${err}`);
}