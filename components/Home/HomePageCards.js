import React from 'react';

const HomePageCards = () => {
  return (
    <div className="row justify-content-between">
      <div className="col-card">
        <div className="card">
          <h3><i className="fa fa-shipping-fast" aria-hidden="true"></i> <span>Free Shipping</span></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><i className="fa fa-thumbs-up" aria-hidden="true" ></i> <span>Quality Products</span></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><i className="fa fa-rupee-sign" aria-hidden="true"></i> <span>Huge Saving</span></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><i className="fa fa-check-square-o" aria-hidden="true"></i> <span>100% Genuine</span></h3>
        </div>
      </div>
    </div>
  );

}
export default HomePageCards