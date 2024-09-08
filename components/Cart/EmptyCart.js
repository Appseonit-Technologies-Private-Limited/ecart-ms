import React from 'react';
import { IoMdCart } from "react-icons/io";
import Link from 'next/link'; // Assuming Next.js routing

const EmptyCart = () => {
    return (
        <div className="container text-center my-5">
            {/* Cart Icon */}
            <IoMdCart  size={100} style={{color: 'var(--app-primary-color)'}}/>

            {/* Empty Cart Message */}
            <h1 className="mt-4">Your Cart is Empty</h1>
            <p className="text-muted mb-4">
                Looks like you haven't added anything to your cart yet! Explore our products and add your favorites.
            </p>

            {/* Recommended Actions */}
            <Link href="/" className="btn btn-primary btn-lg px-5 py-3">Start Shopping
            </Link>

            {/* Additional UX Enhancements */}
            <div className="mt-5">
                <h5>Recommended for You</h5>
                <div className="row justify-content-center mt-3">
                    {/* Product Recommendation Cards */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <img src="/product1.jpg" className="card-img-top" alt="Product 1" />
                            <div className="card-body">
                                <h6 className="card-title">Product Name 1</h6>
                                <p className="card-text">$29.99</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <img src="/product2.jpg" className="card-img-top" alt="Product 2" />
                            <div className="card-body">
                                <h6 className="card-title">Product Name 2</h6>
                                <p className="card-text">$45.99</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <img src="/product3.jpg" className="card-img-top" alt="Product 3" />
                            <div className="card-body">
                                <h6 className="card-title">Product Name 3</h6>
                                <p className="card-text">$19.99</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmptyCart;
