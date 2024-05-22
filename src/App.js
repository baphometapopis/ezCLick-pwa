/* eslint-disable */

// App.js
import { ToastContainer } from "react-toastify";
import './App.css'

import {  storeDataLocalStorage } from "../src/Utils/LocalStorage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import CameraScreen from "./Pages/CameraScreen/CameraScreen";
import ProposalInfoPage from "./Pages/ProposalInfoPage/ProposalInfoPage";
import ShowinspectionImages from "./Pages/ShowMandatoryInspectionimages/ShowMandatoryInspectionimages";
import VideoRecorder from "./Pages/VideoRecord";
import VideoPreview from "./Pages/VideoPreview";
import InspectionCheckpoint from "./Pages/InspectionCheckpoint/InspectionCheckpoint";
import Header from "./Component/Header";
import PermissionPage from "./Pages/Permmission Page/PermissionPage";
import ImageWithFooter from "./Pages/CameraScreen/ImageWithFooter";
import { useEffect } from "react";

function App() {





  return (
    <div className="app-container">
    <BrowserRouter>
              <ToastContainer />


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route  
          path="/proposal-info/:proposalNumber"
          element={<ProposalInfoPage />}
        />
        <Route  
          path="/CheckPermission"
          element={<PermissionPage />}
        />
        <Route 
          path="/InspectionCheckpoint"
          element={<InspectionCheckpoint />}
        />
             <Route
          path="/imagecheck"
          element={<ImageWithFooter />}
        />
        <Route path="/camera" element={<CameraScreen />} />
        <Route
          path="/ShowInspectionImages"
          element={<ShowinspectionImages />}
        />
        <Route path="/VideoRecord" element={<VideoRecorder />} />
        <Route path="/VideoPreview" element={<VideoPreview />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
