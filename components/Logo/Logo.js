import React from 'react'
import { CartLogoIcon } from '../Icons/Icon'
import Link from 'next/link'

const Logo = ({isMobile}) => {
    return (
        <>
            <div className='company-logo-container'>
                <Link href="/">
                    <div className="d-flex align-items-end" style={{ cursor: 'pointer' }}>
                        { !isMobile && <h4 className='company-logo'>{process.env.NEXT_PUBLIC_APP_TITLE}</h4>}
                        <div className='cart-logo'><CartLogoIcon /></div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default Logo