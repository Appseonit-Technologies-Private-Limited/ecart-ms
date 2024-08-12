// pages/unauthorized.js

import React from 'react';
import Link from 'next/link';

const Unauthorized = () => {
  return (
    <div className='unauthorised'>
      <h1>403 Forbidden</h1>
      <p>You do not have permission to access this page.</p>
      <Link href="/">Go Back to Home</Link>
    </div>
  );
};

export default Unauthorized;
