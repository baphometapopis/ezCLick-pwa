import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProposalDetails } from "../../Api/fetchProposalDetails";
import Header from "../../Component/Header";
import SignaturePadComponent from "../../Component/SignaturePadComponent";
import { Search2 } from "../../Constant/ImageConstant";
import { encrypt } from "../../Utils/encryption";
import "./home.css"; // Import CSS file
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const HomePage = () => {
  const navigate=useNavigate()
  const [searchKeyword, setSearchKeyword] = useState(""); // State to store search keyword

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value); // Update search keyword as user types
  };

  const handleSearchSubmit =async () => {
    // Handle search submission logic here

    const res = await fetchProposalDetails(searchKeyword)
    let proposal_id= res?.data?.id
    if(res?.status){

    navigate(`/proposal-info/${encrypt(String(proposal_id))}`)
    }else{

      toast.error(res?.message, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
    }
    // You can perform further actions such as fetching data based on the search keyword
  };

  
  
  useEffect(() => {
    const handlePopstate = (event) => {
      window.history.pushState(null, '', window.location.href);
      event.preventDefault();
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  return (
    <div className="container">
      <Header /> {/* Include the Header component */}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Proposal No ..."
          value={searchKeyword}
          onChange={handleSearchChange} // Update search keyword as user types
        />
        <img
          className="image"
          src={Search2}
          alt="Search"
          style={{ height: "25px", width: "25px", paddingLeft: "12px", cursor: "pointer" }}
          onClick={handleSearchSubmit} // Handle search submission on click
        />
      </div>
      {/* <SignaturePadComponent/> */}
    </div>
  );
};

export default HomePage;
