import { NotificationIcon } from "./Icons/Icon"

const Toast = ({ msg, handleShow}) => {
    return (
        <div className={`toast show`} data-bs-animation="true" data-bs-delay="1000">
            <div className={`toast-header`}>
                {/* <NotificationIcon/> */}
                <strong className="me-auto"></strong>
                <small>just now</small>
                <button type="button" onClick={handleShow} className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body"><span className="toast-msg-icon" style={{color:msg.type == 'error'? '#ff3d00' : 'green'}}>{msg.icon}</span><span className="toast-msg">{msg.msg}</span></div>
        </div>
    )
}

export default Toast