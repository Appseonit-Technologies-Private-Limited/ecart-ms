import { ACTIONS } from './Actions'


const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.NOTIFY:
            return {
                ...state,
                notify: action.payload
            };
        case ACTIONS.AUTH:
            return {
                ...state,
                auth: action.payload
            };
        case ACTIONS.ADD_CART:
            return {
                ...state,
                cart: action.payload
            };
        case ACTIONS.ADD_MODAL:
            return {
                ...state,
                modal: action.payload
            };
        case ACTIONS.ADD_ORDERS:
            return {
                ...state,
                orders: action.payload
            };
        case ACTIONS.ADD_USERS:
            return {
                ...state,
                users: action.payload
            };
        case ACTIONS.ADD_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            };
        case ACTIONS.ADD_ADDRESS:
            return {
                ...state,
                address: action.payload
            };
        case ACTIONS.NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload
            };
        case ACTIONS.WINDOW_WIDTH:
            return {
                ...state,
                windowWidth: action.payload
            };
        default:
            return state;
    }
}

export default reducers