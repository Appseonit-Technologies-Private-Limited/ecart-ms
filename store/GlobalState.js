import { createContext, useReducer, useEffect } from 'react'
import reducers from './Reducers'
import { getData } from '../utils/fetchData'

export const DataContext = createContext()


export const DataProvider = ({ children }) => {
    const initialState = {
        notify: {}, auth: {}, cart: [], modal: [], orders: [], users: [], categories: [], windowWidth: 300
    }

    const [state, dispatch] = useReducer(reducers, initialState)
    const { cart, auth } = state;

    useEffect(() => {
        /**
         * This is the main initial render useEffect
         * 1. Redirecting http to https
         * 2. Calculating window dimensions
         * 3. Checking & authenticating user token (Auto-login if token present).
         * 4. Fetching categories
         */
        if (typeof window !== "undefined"){
            redirectToHttps(window);
            const updateWindowWidth = () => dispatch({ type: "WINDOW_WIDTH", payload: window.innerWidth });
            updateWindowWidth();
            window.addEventListener("resize", updateWindowWidth);
        }

        if (!auth.token) {
            //console.log('Fetching access_token........');
            getData('auth/accessToken').then(res => {
                if (res.err) return;
                
                dispatch({type: "AUTH",
                    payload: {
                        token: res.access_token,
                        user: res.user
                    }
                })
            })
        }

        getData('categories').then(res => {
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
            dispatch({
                type: "ADD_CATEGORIES",
                payload: res.categories
            })
        });

        // Cleanup the event listener when the component unmounts
        return () => {
            if (typeof window !== "undefined" && updateWindowWidth != undefined){
                window.removeEventListener("resize", updateWindowWidth);
            }
        };
    }, []);

    useEffect(() => {
        const __next__cart01 = JSON.parse(localStorage.getItem('__next__cart01'))
      
        if (__next__cart01) dispatch({ type: 'ADD_CART', payload: __next__cart01 })
    }, [])

    useEffect(() => {
        localStorage.setItem('__next__cart01', JSON.stringify(cart))
    }, [cart])

    useEffect(() => {
        if (auth.token) {
            if (auth.user.role === 'admin') {
                getData('user', auth.token)
                    .then(res => {
                        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                        dispatch({ type: 'ADD_USERS', payload: res.users })
                })
            }
        } else {
            dispatch({ type: 'ADD_ORDERS', payload: [] })
            dispatch({ type: 'ADD_USERS', payload: [] })
        }
    }, [auth.token])

    const redirectToHttps = (window) => {
        if (window.location && window.location.hostname !== 'localhost') {
            if (window.location.protocol == 'http:') {
                window.location.href = window.location.href.replace('http:', 'https:');
            }
        }
    }

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    )
}