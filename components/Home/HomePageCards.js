import React from 'react';
import { FreeShippingIcon, GenuineIcon, HugeSavingIcon, QualityProductIcon } from '../Icons/Icon';

const HomePageCards = () => {
  return (
    <div className="row justify-content-between">
      <div className="col-card">
        <div className="card">
          <h3><FreeShippingIcon /><div className='text'>Free Shipping</div></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><QualityProductIcon /><div className='text'>Quality Products</div></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><HugeSavingIcon /><div className='text'>Huge Saving</div></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><GenuineIcon  /><div className='text'>100% Genuine</div></h3>
        </div>
      </div>
    </div>
  );

}
export default HomePageCards