import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { FaEthereum, FaCubes, FaArtstation } from 'react-icons/fa';
import { MdVerified, MdError } from 'react-icons/md';
import { CheckCircle, XCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/ProductStatus.module.css';

const ProductStatus = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [artworkData, setArtworkData] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [errorReason, setErrorReason] = useState('');

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
    const { title, artist, size, owner, isAuthentic } = router.query;
    
    if (title && artist) {
      setArtworkData({
        title,
        artist,
        size: size || 'Unknown',
        owner: owner || 'Unknown'
      });
      
      setIsValid(isAuthentic === 'true');
    } else {
      setIsValid(false);
      setErrorReason('Missing artwork information');
    }
  }, [router.isReady, router.query]);

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
                    {/* Placeholder for artwork image */}
                    <div className={styles.imagePlaceholder}>
                      <FaArtstation className={styles.artIcon} />
                    </div>
                  </div>
                  
                  <div className={styles.detailsContent}>
                    <h3 className={styles.artworkTitle}>{artworkData?.title}</h3>
                    <p className={styles.artworkArtist}>by {artworkData?.artist}</p>
                    
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Size</span>
                        <span className={styles.detailValue}>{artworkData?.size}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Owner</span>
                        <span className={styles.detailValue}>{truncateAddress(artworkData?.owner)}</span>
                      </div>
                    </div>
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
                    <p>{errorReason}</p>
                  </div>
                  <p className={styles.errorHelp}>
                    This artwork could not be verified on the blockchain. 
                    It may be counterfeit or the QR code may be damaged.
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