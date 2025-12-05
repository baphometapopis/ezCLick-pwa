import React, { useEffect, useState } from 'react';
import './InspectionMediaViewer.css';
import { makeApiCall } from '../../Api/makeApiCall';
import { Api_Endpoints } from '../../Api/ApiEndpoint';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Header from '../Header';

const InspectionMediaViewer = () => {
  const [mediaData, setMediaData] = useState([]);
  const [modalMedia, setModalMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const param = useParams();

  const openModal = (url, type) => setModalMedia({ url, type });
  const closeModal = () => setModalMedia(null);

  const downloadFile = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name || 'inspection_media');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  

  const fetchProposalImages = async (proposalNo) => {
    try {
      setLoading(true);
      const res = await makeApiCall(Api_Endpoints.getAllInspectionImages, 'POST', {
        proposal_no: proposalNo,
      });

      // `makeApiCall` should return the JSON directly (check your helper)
      if (res.status && Array.isArray(res.images)) {
        setMediaData(res.images);
      } else {
        setError(res.message || 'No media found.');
      }
    } catch (e) {
      console.error('Error fetching proposal images:', e);
      toast.error('Error while fetching proposal images');
      setError('Failed to load media.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (param?.number) {
      fetchProposalImages(param.number);
    }
  }, [param.number]);

  // Handle file types
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff|heic)$/i;
  const videoExtensions = /\.(mp4|mov|avi|wmv|flv|mkv|webm|m4v)$/i;

  const images = mediaData.filter((item) => imageExtensions.test(item.name));
  const videos = mediaData.filter((item) => videoExtensions.test(item.name));

  if (loading) return <p>Loading inspection media...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
<>
    <Header checkLocal={false} /> {/* Include the Header component */}

    <div className="inspection-wrapper">

      <h2>Inspection Image Reports</h2>

      <div className="inspection-grid">
        {images.length > 0 ? (
          images.map((item, index) => (
            <div key={index} className="inspection-card">
              <img
                src={item.url}
                alt={item.name}
                className="inspection-image"
                onClick={() => openModal(item.url, 'image')}
              />
              <div className="inspection-name">{item.name}</div>
              <div className="button-group">
                <button
                  onClick={() => openModal(item.url, 'image')}
                  className="preview-btn"
                >
                  Preview
                </button>
                <button
                  onClick={() => downloadFile(item.url, item.name)}
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>

      <h2>Inspection Videos</h2>

      <div className="video-container">
        {videos.length > 0 ? (
          videos.map((vid, index) => (
            <div key={index} className="inspection-card">
              <video className="inspection-video" controls>
                <source src={vid.url} />
                Your browser does not support the video tag.
              </video>
              <div className="inspection-name">{vid.name}</div>
              <div className="button-group">
                <button
                  onClick={() => openModal(vid.url, 'video')}
                  className="preview-btn"
                >
                  Preview
                </button>
                <button
                  onClick={() => downloadFile(vid.url, vid.name)}
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <h3>No videos found.</h3>
        )}
      </div>

      {modalMedia && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modalMedia.type === 'image' ? (
              <img src={modalMedia.url} alt="Preview" />
            ) : (
              <video src={modalMedia.url} controls autoPlay />
            )}
            <button onClick={closeModal} className="close-btn">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
</>
);
};

export default InspectionMediaViewer;
