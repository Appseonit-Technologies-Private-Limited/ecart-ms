import { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import Toast from './Toast'
import { SuccessIcon, WarnIcon } from './Icons/Icon'
import { CONTACT_ADMIN_ERR_MSG } from '../utils/constants'

const Notify = () => {
    const { state, dispatch } = useContext(DataContext)
    const { notify } = state

    if (notify.error || notify.success) {
        setTimeout(() => {
            dispatch({ type: 'NOTIFY', payload: {} })
        }, notify.delay ? notify.delay : 6000);
    }

    return (
        <>
            {(notify.error || notify.success) &&
                <Toast
                    msg={
                            { 
                                msg: notify.error || notify.success || CONTACT_ADMIN_ERR_MSG, 
                                type: notify.error ? "error" : "success",
                                icon: notify.error ? <WarnIcon/> : <SuccessIcon/>
                            }
                        }   
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                />
            }
        </>
    )
}


export default Notify
