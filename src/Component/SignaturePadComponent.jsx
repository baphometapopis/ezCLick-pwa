import React, { useRef } from 'react';
import SignaturePad from 'react-signature-pad-wrapper';

const SignaturePadComponent = () => {
  const signaturePadRef = useRef(null);

  const clearSignature = () => {
    signaturePadRef.current.clear();
  };

  const saveSignature = () => {
    const dataURL = signaturePadRef.current.toDataURL();
    console.log(dataURL); // You can save this data URL or send it to your server
  };

  return (
    <div>
      <SignaturePad ref={signaturePadRef} options={{ penColor: 'blue' ,    backgroundColor: 'white', }} />
      <button onClick={clearSignature}>Clear</button>
      <button onClick={saveSignature}>Save</button>
    </div>
  );
};

export default SignaturePadComponent;
