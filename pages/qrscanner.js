import React, { useState, useEffect, useRef, useCallback } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import { FaEthereum, FaCubes, FaCamera } from 'react-icons/fa';
import { MdVerified, MdError } from 'react-icons/md';
import { CheckCircle } from 'lucide-react';
import jsQR from 'jsqr';
import styles from '../styles/QRScanner.module.css';

// Updated Contract ABI to match your new ProductRegistry contract
const contractABI = [
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "string", name: "_artist", type: "string" },
      { internalType: "string", name: "_size", type: "string" },
      { internalType: "string", name: "_medium", type: "string" },
      { internalType: "uint16", name: "_yearCreated", type: "uint16" }
    ],
    name: "addProduct",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getTotalProducts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_productId", type: "uint256" }],
    name: "getProductById",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "artist", type: "string" },
          { internalType: "string", name: "size", type: "string" },
          { internalType: "string", name: "medium", type: "string" },
          { internalType: "uint16", name: "yearCreated", type: "uint16" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "bool", name: "exists", type: "bool" }
        ],
        internalType: "struct ProductRegistry.Product",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    name: "getProductsByOwner",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "artist", type: "string" },
          { internalType: "string", name: "size", type: "string" },
          { internalType: "string", name: "medium", type: "string" },
          { internalType: "uint16", name: "yearCreated", type: "uint16" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "bool", name: "exists", type: "bool" }
        ],
        internalType: "struct ProductRegistry.Product[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_start", type: "uint256" },
      { internalType: "uint256", name: "_count", type: "uint256" }
    ],
    name: "getProductsPaginated",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "artist", type: "string" },
          { internalType: "string", name: "size", type: "string" },
          { internalType: "string", name: "medium", type: "string" },
          { internalType: "uint16", name: "yearCreated", type: "uint16" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "bool", name: "exists", type: "bool" }
        ],
        internalType: "struct ProductRegistry.Product[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "ownerProductIds",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "productCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
];

const contractAddress = '0x99156b9128af758848e8eb70b4fda342566c06b3';
const RPC_URL = 'https://sepolia.infura.io/v3/0b71ad43bec649f691d94324ae744684';

const QRScanner = () => {
  const router = useRouter();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [scanAttempts, setScanAttempts] = useState(0);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const isProcessingRef = useRef(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [accounts, setAccounts] = useState([]);

  // Loading effect similar to Home.js
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Error handling function
  const handleError = useCallback((message, type = 'error') => {
    console.error(message);
    
    const toastTypes = {
      'error': toast.error,
      'warning': toast.warn,
      'success': toast.success,
      'info': toast.info
    };

    const toastMethod = toastTypes[type] || toast.error;
    
    toastMethod(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  // Periodically check blockchain connection
  useEffect(() => {
    let intervalId;
    
    const checkConnection = async () => {
      if (web3) {
        try {
          await web3.eth.net.isListening();
          setNetworkError(false);
        } catch (error) {
          setNetworkError(true);
          console.error('Blockchain connection error:', error);
        }
      }
    };
    
    // Check connection immediately and then every 10 seconds
    checkConnection();
    intervalId = setInterval(checkConnection, 10000);
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [web3]);

  // Web3 Initialization - No MetaMask Required
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = new Web3(new Web3.providers.HttpProvider(RPC_URL));
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(
          contractABI, 
          contractAddress
        );
        setContract(contractInstance);

        try {
          // Test connection by getting block number
          await web3Instance.eth.getBlockNumber();
          
          // Get accounts for later use
          const accts = await web3Instance.eth.getAccounts();
          setAccounts(accts);
          
        } catch (connectionError) {
          throw new Error(`Failed to connect to blockchain: ${connectionError.message}`);
        }

      } catch (error) {
        handleError(error.message || 'Web3 initialization failed');
        setNetworkError(true);
      }
    };

    initWeb3();
  }, [handleError]);

  // Helper function to convert BigInt values to regular numbers
  const normalizeBlockchainData = (data) => {
    if (data === null || data === undefined) return data;
    
    if (typeof data === 'bigint') {
      return Number(data);
    }
    
    if (typeof data === 'object' && !Array.isArray(data)) {
      const result = {};
      for (const key in data) {
        result[key] = normalizeBlockchainData(data[key]);
      }
      return result;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => normalizeBlockchainData(item));
    }
    
    return data;
  };

  // Verify Product on Blockchain with Read-only Access
  const verifyProductOnBlockchain = async (productDetails) => {
    if (!contract || !web3) {
      handleError('Web3 or contract not initialized');
      return null;
    }

    try {
      // Get total products count
      const totalProducts = await contract.methods.productCount().call();
      const totalProductsNumber = Number(totalProducts);
      const batchSize = 20;
      
      // Get admin address
      let adminAddress;
      try {
        adminAddress = await contract.methods.admin().call();
      } catch (adminError) {
        console.error('Error getting admin address:', adminError);
        // If admin method fails, use the first account as fallback
        adminAddress = accounts.length > 0 ? accounts[0] : null;
      }

      // Search through all products in batches
      for (let i = 0; i < totalProductsNumber; i += batchSize) {
        try {
          const batch = await contract.methods.getProductsPaginated(i, Math.min(batchSize, totalProductsNumber - i)).call();
          const normalizedBatch = normalizeBlockchainData(batch);
          
          for (let j = 0; j < normalizedBatch.length; j++) {
            const product = normalizedBatch[j];
            
            // Case-insensitive matching for title and artist
            const isTitleMatch = product.title.toLowerCase() === productDetails.title.toLowerCase();
            const isArtistMatch = product.artist.toLowerCase() === productDetails.artist.toLowerCase();
            
            if (isTitleMatch && isArtistMatch) {
              const productIndex = i + j;

              return {
                isAuthentic: true,
                owner: product.owner || adminAddress,
                productIndex: productIndex,
                details: product
              };
            }
          }
        } catch (batchError) {
          console.error(`Error in batch ${i}:`, batchError);
          // Continue with next batch even if one fails
        }
      }

      return { isAuthentic: false, reason: 'Artwork not found in blockchain registry' };
    } catch (error) {
      handleError(`Blockchain verification error: ${error.message}`);
      return null;
    }
  };

  // Handle Redirect after Verification
  const handleRedirect = useCallback(async (productDetails) => {
    setIsLoading(true);
    
    try {
      // Check network connection first
      if (networkError) {
        throw new Error('Blockchain network connection error. Please try again later.');
      }
      
      // Validate required fields
      if (!productDetails.title || !productDetails.artist) {
        throw new Error('Missing required artwork details in QR code');
      }
      
      // Verify the product against blockchain data
      const verificationResult = await verifyProductOnBlockchain(productDetails);

      if (!verificationResult) {
        throw new Error('Verification process failed to complete');
      }

      if (verificationResult.isAuthentic) {
        // Show success animation
        setShowSuccessAnimation(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Navigate to product status page with verification details
        const { details } = verificationResult;
        router.push(
          `/product-status?title=${encodeURIComponent(details.title)}` +
          `&artist=${encodeURIComponent(details.artist)}` +
          `&size=${encodeURIComponent(details.size || '')}` +
          `&medium=${encodeURIComponent(details.medium || '')}` +
          `&description=${encodeURIComponent(details.description || '')}` +
          `&yearCreated=${encodeURIComponent(details.yearCreated || '')}` +
          `&owner=${encodeURIComponent(verificationResult.owner)}` +
          `&isAuthentic=true` +
          `&productIndex=${verificationResult.productIndex}`
        );
      } else {
        // Handle failed verification
        const errorMessage = verificationResult?.reason || 'Artwork not found in blockchain registry';
        handleError(errorMessage, 'warning');
        router.push('/product-status?invalid=true&reason=' + encodeURIComponent(errorMessage));
      }
    } catch (error) {
      handleError(`Verification process failed: ${error.message}`);
      router.push('/product-status?invalid=true&reason=' + encodeURIComponent(error.message));
    } finally {
      setIsLoading(false);
      setShowSuccessAnimation(false);
    }
  }, [router, handleError, networkError, verifyProductOnBlockchain]);

  // Improved QR code processing to handle multiple formats
  const processQRCode = useCallback(async () => {
    const video = videoRef.current;
    if (!video || isProcessingRef.current || !isScanning) return false;
  
    isProcessingRef.current = true;
  
    try {
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
  
      if (code) {
        try {
          // Try parsing as JSON first
          let productDetails;
          try {
            productDetails = JSON.parse(code.data);
          } catch (jsonError) {
            // If not JSON, try to parse as URL with parameters
            if (code.data.includes('?') && code.data.includes('=')) {
              const params = new URLSearchParams(code.data.split('?')[1]);
              productDetails = {
                title: params.get('title'),
                artist: params.get('artist'),
                size: params.get('size') || '',
                medium: params.get('medium') || '',
                description: params.get('description') || '',
                yearCreated: params.get('yearCreated') || ''
              };
            } else {
              // Simple format: might be title|artist|size|medium|yearCreated
              const parts = code.data.split('|');
              if (parts.length >= 2) {
                productDetails = {
                  title: parts[0].trim(),
                  artist: parts[1].trim(),
                  size: parts[2] || '',
                  medium: parts[3] || '',
                  description: parts[4] || '',
                  yearCreated: parts[5] || ''
                };
              } else {
                throw new Error('Unrecognized QR code format');
              }
            }
          }
  
          if (!productDetails.title || !productDetails.artist) {
            throw new Error('Invalid artwork details in QR code');
          }
  
          setIsScanning(false);
          handleRedirect(productDetails);
          return true;
        } catch (err) {
          toast.error('Invalid QR code format: ' + err.message, {
            position: "bottom-right",
            autoClose: 3000,
          });
          return false;
        }
      }
      return false;
    } catch (err) {
      toast.error('Error processing QR code', {
        position: "bottom-right",
        autoClose: 3000,
      });
      return false;
    } finally {
      isProcessingRef.current = false;
    }
  }, [handleRedirect, isScanning]);

  // File Input Change Handler with improved format support
  const handleFileInputChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      try {
        const imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        });
  
        const img = await new Promise((resolve) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.src = imageUrl;
        });
  
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
  
        if (code) {
          try {
            // Try parsing as JSON first
            let productDetails;
            try {
              productDetails = JSON.parse(code.data);
            } catch (jsonError) {
              // If not JSON, try to parse as URL with parameters
              if (code.data.includes('?') && code.data.includes('=')) {
                const params = new URLSearchParams(code.data.split('?')[1]);
                productDetails = {
                  title: params.get('title'),
                  artist: params.get('artist'),
                  size: params.get('size') || '',
                  medium: params.get('medium') || '',
                  description: params.get('description') || '',
                  yearCreated: params.get('yearCreated') || ''
                };
              } else {
                // Simple format: might be title|artist|size|medium|yearCreated
                const parts = code.data.split('|');
                if (parts.length >= 2) {
                  productDetails = {
                    title: parts[0].trim(),
                    artist: parts[1].trim(),
                    size: parts[2] || '',
                    medium: parts[3] || '',
                    description: parts[4] || '',
                    yearCreated: parts[5] || ''
                  };
                } else {
                  throw new Error('Unrecognized QR code format');
                }
              }
            }
            
            if (!productDetails.title || !productDetails.artist) {
              throw new Error('Missing required artwork details in QR code');
            }
            
            handleRedirect(productDetails);
          } catch (err) {
            toast.error('Invalid QR code format: ' + err.message, {
              position: "bottom-right",
              autoClose: 3000,
            });
          }
        } else {
          toast.warning('No QR code found in the image', {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } catch (err) {
        toast.error('Error reading file: ' + err.message, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    },
    [handleRedirect]
  );
  
  // Retry scan
  const handleRetry = () => {
    setIsScanning(true);
    setScanAttempts(prev => prev + 1);
    setNetworkError(false);
    
    // Restart video if needed
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // Force component update
    setTimeout(() => {
      if (videoRef.current) {
        navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        }).then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }).catch(err => {
          handleError(`Camera restart failed: ${err.message}`);
        });
      }
    }, 500);
  };
  
  // Video Stream Setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let processingInterval = null;

    const startVideoStream = async () => {
      try {
        const constraints = {
          video: { 
            facingMode: 'environment', 
            width: { ideal: 640 }, 
            height: { ideal: 480 } 
          },
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
        if (stream.getTracks().length === 0) {
          throw new Error('No video tracks available');
        }
    
        video.srcObject = stream;
        
        video.addEventListener('loadedmetadata', () => {
          video.play();
          processingInterval = setInterval(async () => {
            if (isScanning) {
              const found = await processQRCode();
              if (found) {
                clearInterval(processingInterval);
              }
            }
          }, 500);
        });
      } catch (err) {
        handleError(`Camera access failed: ${err.message}`);
      }
    };

    startVideoStream();

    const handleResize = () => {
      if (videoRef.current) {
        videoRef.current.style.maxWidth = '100%';
        videoRef.current.style.height = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      if (processingInterval) {
        clearInterval(processingInterval);
      }
    };
  }, [processQRCode, isScanning, handleError, scanAttempts]);

  const handleBackToHome = () => {
    router.push('/');
  };

  // Handle the upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.container}>
      <Header />
      
      {/* Scanner Section */}
      <div className={styles.scannerSection}>
        <div className={styles.scannerContent}>
          <h1 className={styles.scannerTitle}>
            <span className={styles.scannerTitleHighlight}>Art</span>Chain
            <span className={styles.scannerSubtitle}>Authenticator</span>
          </h1>
          
          <div className={styles.scannerContainer}>
            {isLoading || showSuccessAnimation ? (
              <div className={styles.loadingOverlay}>
                {showSuccessAnimation ? (
                  <div className={styles.successAnimation}>
                    <CheckCircle 
                      size={64} 
                      className={styles.scaleInAnimation}
                    />
                    <p className={styles.successText}>Artwork Verified!</p>
                  </div>
                ) : (
                  <div className={styles.loadingAnimation}>
                    <div className={styles.pulseCircle}></div>
                    <p className={styles.loadingText}>Verifying Artwork...</p>
                  </div>
                )}
              </div>
            ) : networkError ? (
              <div className={styles.errorOverlay}>
                <div className={styles.errorMessage}>
                  <MdError size={48} className={styles.errorIcon} />
                  <h3>Blockchain Connection Error</h3>
                  <p>Unable to connect to the blockchain network.</p>
                  <button className={styles.retryButton} onClick={handleRetry}>
                    Retry Connection
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.scannerFrame}>
                  <video 
                    ref={videoRef} 
                    className={styles.scannerVideo}
                    playsInline 
                  />
                  <div className={styles.scannerOverlay}>
                    <div className={styles.scannerCorner} style={{ top: 0, left: 0 }}></div>
                    <div className={styles.scannerCorner} style={{ top: 0, right: 0 }}></div>
                    <div className={styles.scannerCorner} style={{ bottom: 0, left: 0 }}></div>
                    <div className={styles.scannerCorner} style={{ bottom: 0, right: 0 }}></div>
                    <div className={styles.scanLine}></div>
                  </div>
                </div>
                <div className={styles.scannerInfo}>
                  <MdVerified className={styles.verifyIcon} />
                  <p>Position QR code within frame</p>
                </div>
              </>
            )}
          </div>
          
          <div className={styles.scannerButtons}>
            <button
              onClick={handleUploadClick}
              className={styles.primaryButton}
              disabled={isLoading || showSuccessAnimation}
            >
              Upload QR Code
              <FaCamera className={styles.buttonIcon} />
            </button>
            <button
              onClick={handleBackToHome}
              className={styles.secondaryButton}
            >
              Back to Gallery
            </button>
          </div>
          {/* Fixed file input to prevent camera opening on mobile */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
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

export default QRScanner;