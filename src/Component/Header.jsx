/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo1 } from "../Constant/ImageConstant";
import { fetchDataLocalStorage } from "../Utils/LocalStorage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = ({ checkLocal }) => {
  const navigate = useNavigate();
  const [networkStatus, setNetworkStatus] = useState('offline');

  const fetchDataFromLocalStorage = async () => {
    const localdata = await fetchDataLocalStorage('Claim_loginDetails');
    const proposalInfo = await fetchDataLocalStorage('Claim_proposalDetails');
    if (localdata === null || proposalInfo === null) {
      navigate('/', { replace: true });
      // Show toast message
      toast.error('Session Terminated', {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
    }
  };

  const updateNetworkStatus = () => {
    if (!navigator.onLine) {
      setNetworkStatus('offline');
    } else if (navigator.connection) {
      const { effectiveType } = navigator.connection;
      switch (effectiveType) {
        case '4g':
          setNetworkStatus('good');
          break;
        case '3g':
          setNetworkStatus('poor');
          break;
        case '2g':
        case 'slow-2g':
          setNetworkStatus('bad');
          break;
        default:
          setNetworkStatus('unknown');
          break;
      }
    } else {
      setNetworkStatus('online');
    }
  };

  useEffect(() => {
    if (checkLocal) {
      fetchDataFromLocalStorage();
    }
  }, []);

  useEffect(() => {
    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return (
    <header style={{ padding: '10px', backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset', position: 'fixed', width: '100%', top: '0px', zIndex: 50 }}>
      <img src={Logo1} alt="Logo" style={{ width: '120px' }} />
      <div style={{ position: 'absolute', right: '45px', top: '25px' }}>
        {networkStatus === 'offline' && <span style={{ color: 'red' }}>Offline</span>}
        {networkStatus === 'good' && <span style={{ color: 'green' }}>Network: Good</span>}
        {networkStatus === 'poor' && <span style={{ color: 'orange' }}>Network: Poor</span>}
        {networkStatus === 'bad' && <span style={{ color: 'red' }}>Network: Bad</span>}
        {networkStatus === 'unknown' && <span style={{ color: 'gray' }}>Network: Unknown</span>}
      </div>
    </header>
  );
};

export default Header;
