/* eslint-disable */
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo1 } from "../Constant/ImageConstant";
import { fetchDataLocalStorage } from "../Utils/LocalStorage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Header = ({ checkLocal }) => {
  const navigate = useNavigate();
  const fetchDataFromLocalStorage = async () => {
 
    const localdata = await fetchDataLocalStorage('Claim_loginDetails');

    const proposalInfo = await fetchDataLocalStorage('Claim_proposalDetails');
    if (localdata === null || proposalInfo === null) {
      navigate('/', { replace: true });
      // Show toast message
      toast.error('Sesion Terminated', {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
      }
  };

  useEffect(() => {
    if (checkLocal) {
      fetchDataFromLocalStorage();
    }
  }, []);

  return (
    <header style={{ padding: '10px', backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset',position:'fixed',width:'100%',top:'0px' ,zIndex:50}} >
        <img src={Logo1} alt="Logo" style={{ width: '120px' }} />
    </header>
  );
};

export default Header;
