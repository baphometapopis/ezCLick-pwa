import React, { useRef } from 'react';
import SignaturePad from 'react-signature-pad-wrapper';

const SignaturePadComponent = ({getSignature}) => {
  const signaturePadRef = useRef(null);

  const clearSignature = () => {
    signaturePadRef.current.clear();
  };

  const saveSignature = () => {
    const dataURL = signaturePadRef.current.toDataURL();
    getSignature(dataURL)
  };

  return (
    <div >
      <p>Draw you Signature inside the Box</p>
      <div style={{border: '2px solid #6d6d6d' ,margin:'10px'  , borderRadius:'5px'}}>


      <SignaturePad ref={signaturePadRef} options={{ penColor: 'black' ,    backgroundColor: 'white', }} redrawOnResize={true} />
      </div>
      <button onClick={clearSignature}>Clear</button>
      <button onClick={saveSignature}>Save</button>
    </div>
  );
};

export default SignaturePadComponent;
