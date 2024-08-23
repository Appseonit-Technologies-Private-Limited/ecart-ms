import React from 'react';
import { FaShippingFast } from 'react-icons/fa';
import { MdGppGood } from 'react-icons/md';
import { FaArrowUpRightDots } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";

const HomePageCards = () => {
  return (
    <div className="row justify-content-between">
      <div className="col-card">
        <div className="card">
          <h3><FaShippingFast /><div className='text'>Free Shipping</div></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><FaArrowUpRightDots /><div className='text'>Quality Products</div></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><GrMoney /><div className='text'>Huge Saving</div></h3>
        </div>
      </div>

      <div className="col-card">
        <div className="card">
          <h3><MdGppGood /><div className='text'>100% Genuine</div></h3>
        </div>
      </div>
    </div>
  );

}
export default HomePageCards