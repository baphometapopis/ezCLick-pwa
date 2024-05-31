import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOTP, verifyOTP } from '../../Api/getOTP';
import { EmailVerification, OtpImage } from '../../Constant/ImageConstant';
import './OtpScreen.css'; // Import CSS file for styling
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtpScreen = () => {
  const { state } = useLocation();
  const inputRefs = useRef([]);

  const navigate=useNavigate()
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpBoxes, setOtpBoxes] = useState(['', '', '', '', '', '']);
  const [ProposalInfo, setProposalInfo] = useState(state?.proposaldata);

  const maskEmail = (email) => {
    const atIndex = email.indexOf('@');
    const firstTwoCharacters = email.slice(0, 2);
    const maskedPart = email.slice(2, atIndex).replace(/./g, '*');
    const visiblePart = email.slice(atIndex);
    return firstTwoCharacters + maskedPart + visiblePart;
  };

  const handleEmailVerification = async () => {
    if (email === ProposalInfo.email) {
      const data = {
        break_in_case_id: ProposalInfo?.breakin_inspection_id,
        proposal_id: ProposalInfo?.id,
        email_id: ProposalInfo?.email
      };

      const apires = await getOTP(data);
      if (apires?.status) {
        setIsEmailVerified(true);

        toast.success(apires?.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
      } else {
        toast.error(apires?.message, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "colored",
        });
      }
    } else {
      toast.error("Incorrect Email", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
    }
  };

  const handleOtpSubmit = async () => {
    const data = {
        otp: otp,
        proposal_id: ProposalInfo?.id,
        email_id: ProposalInfo?.email
      };
    if(otp){
        const apires= await verifyOTP(data)
        console.log(apires)
        if (apires?.status) {
            toast.success(apires?.message, {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "colored",
            });

                     navigate(`/proposal-info/${ProposalInfo?.proposal_no}`,{replace:true});

          } else {
            toast.error(apires?.message, {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              theme: "colored",
            });
          }
    }
    else{
        alert('please Enter OTP ')
    }
};

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) { // Ensure only digits are entered
      const updatedOtpBoxes = [...otpBoxes];
      updatedOtpBoxes[index] = value;
      setOtpBoxes(updatedOtpBoxes);
      setOtp(updatedOtpBoxes.join(''));

      // Move focus to the next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpBoxes[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="otp-container">
      {!isEmailVerified ? (
        <div className="email-verification">
          <img src={EmailVerification} style={{ height: '120px', width: '150px' }} alt="Email Verification" />
          <h2>Email Verification</h2>
          <p>Enter the registered {maskEmail(ProposalInfo?.email)} mail</p>
          <input
            type="text"
            placeholder="Enter registered email"
            value={email}
            style={{ width: '85%' }}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <button onClick={handleEmailVerification} className="verify-btn">Verify Email</button>
        </div>
      ) : (
        <div className="otp-input">
          <img src={OtpImage} style={{ height: '120px', width: '150px' }} alt="OTP Verification" />
          <h2>Enter OTP</h2>
          <div className="otp-boxes">
            {otpBoxes.map((box, index) => (
              <input
                key={index}
                type="text"
                value={box}
                maxLength={1}
                ref={el => inputRefs.current[index] = el}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={box ? 'otp-box filled' : 'otp-box'}
              />
            ))}
          </div>
          <button onClick={handleOtpSubmit} className="submit-btn">Submit OTP</button>
        </div>
      )}
    </div>
  );
};

export default OtpScreen;
