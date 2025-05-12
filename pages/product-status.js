import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { FaEthereum, FaCubes, FaArtstation } from 'react-icons/fa';
import { MdVerified, MdError } from 'react-icons/md';
import { CheckCircle, XCircle, Image } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/ProductStatus.module.css';

const ProductStatus = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [artworkData, setArtworkData] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [errorReason, setErrorReason] = useState('');
  const [productIndex, setProductIndex] = useState(null);
  const [artworkImage, setArtworkImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Loading effect similar to QRScanner
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Parse URL parameters when router is ready
  useEffect(() => {
    if (!router.isReady) return;

    // Check if we have an invalid artwork case
    if (router.query.invalid === 'true') {
      setIsValid(false);
      setErrorReason(router.query.reason || 'Unknown verification error');
      return;
    }

    // Get artwork details from query parameters
    const { 
      title, 
      artist, 
      size, 
      medium, 
      description, 
      yearCreated, 
      owner, 
      isAuthentic, 
      productIndex 
    } = router.query;
    
    if (title && artist) {
      const artwork = {
        title,
        artist,
        size: size || 'Unknown',
        medium: medium || 'Unknown',
        description: description || '',
        yearCreated: yearCreated || 'Unknown',
        owner: owner || 'Unknown'
      };
      
      setArtworkData(artwork);
      setIsValid(isAuthentic === 'true');
      
      if (productIndex) {
        setProductIndex(Number(productIndex));
      }
      
      // Fetch artwork image
      if (isAuthentic === 'true') {
        fetchArtworkImage(title, artist);
      }
    } else {
      setIsValid(false);
      setErrorReason('Missing artwork information');
    }
  }, [router.isReady, router.query]);

  // Function to fetch artwork image from MongoDB
  const fetchArtworkImage = async (title, artist) => {
    try {
      setImageLoading(true);
      const response = await fetch(`/api/artwork-images?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
      
      if (response.ok) {
        const imageData = await response.json();
        if (imageData && imageData.length > 0) {
          // Use the first image if there are multiple
          setArtworkImage(imageData[0].image);
        }
      }
    } catch (error) {
      console.error('Error fetching artwork image:', error);
      toast.error('Could not load artwork image');
    } finally {
      setImageLoading(false);
    }
  };

  // Render artwork image or placeholder
  const renderArtworkImage = () => {
    if (imageLoading) {
      return (
        <div className={styles.loadingImage}>
          <div className={styles.pulseCircle}></div>
        </div>
      );
    }
    
    if (!artworkImage) {
      return (
        <div className={styles.imagePlaceholder}>
          <FaArtstation className={styles.artIcon} />
        </div>
      );
    }
    
    return (
      <img 
        src={artworkImage} 
        alt={artworkData?.title}
        className={styles.actualArtworkImage} 
      />
    );
  };

  const handleBackToScanner = () => {
    router.push('/qrscanner');
  };

  const handleViewGallery = () => {
    router.push('/');
  };

  const truncateAddress = (address) => {
    if (!address || address === 'Unknown') return 'Unknown';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format error messages in a user-friendly way
  const formatErrorMessage = (message) => {
    // Common blockchain error patterns
    if (message.includes('not found') || message.includes('not registered')) {
      return 'This artwork is not registered in our blockchain Network.';
    }
    
    if (message.includes('connection') || message.includes('network')) {
      return 'Network connection issue. The blockchain could not be accessed.';
    }
    
    // Return original message if no pattern matches
    return message;
  };

  return (
    <div className={styles.container}>
      <Header />
      
      {/* Status Section */}
      <div className={styles.statusSection}>
        <div className={styles.statusContent}>
          <h1 className={styles.statusTitle}>
            <span className={styles.statusTitleHighlight}>Art</span>Chain
            <span className={styles.statusSubtitle}>Verification Result</span>
          </h1>
          
          <div className={styles.statusContainer}>
            {!loaded ? (
              <div className={styles.loadingAnimation}>
                <div className={styles.pulseCircle}></div>
                <p className={styles.loadingText}>Loading Results...</p>
              </div>
            ) : isValid ? (
              <div className={styles.validResult}>
                <div className={styles.resultHeader}>
                  <CheckCircle size={64} className={styles.validIcon} />
                  <h2 className={styles.resultTitle}>Authentic Artwork</h2>
                  <div className={styles.verifiedBadge}>
                    <MdVerified /> Blockchain Verified
                  </div>
                </div>
                
                <div className={styles.artworkDetails}>
                  <div className={styles.artworkImage}>
                    {/* Now using actual artwork image or placeholder */}
                    {renderArtworkImage()}
                  </div>
                  
                  <div className={styles.detailsContent}>
                    <h3 className={styles.artworkTitle}>{artworkData?.title}</h3>
                    <p className={styles.artworkArtist}>by {artworkData?.artist}</p>
                    
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Size</span>
                        <span className={styles.detailValue}>{artworkData?.size}</span>
                      </div>
                      {artworkData?.medium && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Medium</span>
                          <span className={styles.detailValue}>{artworkData?.medium}</span>
                        </div>
                      )}
                      {artworkData?.yearCreated && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Year</span>
                          <span className={styles.detailValue}>{artworkData?.yearCreated}</span>
                        </div>
                      )}
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Owner</span>
                        <span className={styles.detailValue}>{truncateAddress(artworkData?.owner)}</span>
                      </div>
                    
                    </div>
                    
                    {artworkData?.description && (
                      <div className={styles.descriptionItem}>
                        <span className={styles.detailLabel}>Description</span>
                        <p className={styles.detailDescription}>{artworkData?.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.blockchainInfo}>
                  <div className={styles.infoItem}>
                    <FaEthereum className={styles.infoIcon} />
                    <span>Ethereum Blockchain</span>
                  </div>
                  <div className={styles.infoItem}>
                    <FaCubes className={styles.infoIcon} />
                    <span>Immutable Record</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.invalidResult}>
                <div className={styles.resultHeader}>
                  <XCircle size={64} className={styles.invalidIcon} />
                  <h2 className={styles.resultTitle}>Verification Failed</h2>
                </div>
                
                <div className={styles.errorContent}>
                  <div className={styles.errorMessage}>
                    <MdError className={styles.errorIcon} />
                    <p>{formatErrorMessage(errorReason)}</p>
                  </div>
                  <p className={styles.errorHelp}>
                    This artwork could not be verified on the blockchain. 
                    It may be not authentic, the QR code may be damaged, the image scanned or uploaded is not clear, or there might be a network issue.
                      </p>
                      <p className={styles.errorHelp}>
                    TPLEASE TRY SCANNING AGAIN. 
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.statusButtons}>
            <button
              onClick={handleBackToScanner}
              className={styles.primaryButton}
            >
              Scan Another Artwork
            </button>
            <button
              onClick={handleViewGallery}
              className={styles.secondaryButton}
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Technology Icons */}
      <div className={styles.techSection}>
        <h2 className={styles.sectionTitle}>Powered by <span className={styles.highlightText}>Blockchain</span></h2>
        <div className={styles.techIcons}>
          <div className={styles.techItem}>
            <FaEthereum className={styles.techIcon} />
            <span className={styles.techLabel}>Ethereum</span>
          </div>
          <div className={styles.techItem}>
            <FaCubes className={styles.techIcon} />
            <span className={styles.techLabel}>Blockchain</span>
          </div>
          <div className={styles.techItem}>
            <MdVerified className={styles.techIcon} />
            <span className={styles.techLabel}>Verification</span>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProductStatus;