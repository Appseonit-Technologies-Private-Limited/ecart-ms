import React from 'react';
import { FreeShippingIcon, GenuineIcon, HugeSavingIcon, QualityProductIcon } from '../Icons/Icon';

const TrustBadges = () => {
  return (
    <div className="row justify-content-between">
      <div className="trust-badge">
        
          <h3><FreeShippingIcon /><div className='text'>Free Shipping</div></h3>
      </div>

      <div className="trust-badge">
        
          <h3><QualityProductIcon /><div className='text'>Quality Products</div></h3>
      </div>

      <div className="trust-badge">
        
          <h3><HugeSavingIcon /><div className='text'>Huge Saving</div></h3>
      </div>

      <div className="trust-badge">
        
          <h3><GenuineIcon  /><div className='text'>100% Genuine</div></h3>
      </div>
    </div>
  );

}
export default TrustBadges