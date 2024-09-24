import React from 'react'
import NavBar from './NavBar'
import Notify from './Notify'
import Modal from './Modal'
import Footer from './Footer'

function Layout({children}) {
    return (
        <div className="main">
            <NavBar />
            <Notify />
            <Modal />
            {children}
            <br></br>
            <br></br>
            {/* <Footer /> */}
        </div>
    )
}

export default Layout
