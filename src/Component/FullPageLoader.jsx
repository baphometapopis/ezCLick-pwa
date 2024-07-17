// src/components/FullPageLoader.js

import React from 'react';
import {Logo1 } from '../Constant/ImageConstant';
import './FullPageLoader.css';

const FullPageLoader = ({ loading, imageSrc }) => {
  return (
    <div className={`loader-overlay ${loading ? 'show' : ''}`}>
      <img src={Logo1} alt="Loading..." className="loader-image" />
    </div>
  );
};

export default FullPageLoader;
