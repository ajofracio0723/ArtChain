import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header2';
import { FaDownload, FaUpload } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import Web3 from 'web3';
import QRCode from 'qrcode';
import styles from '../styles/AddProductForm.module.css';

// Updated ABI to match the contract structure
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
    inputs: [],
    name: "productCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
];

const contractAddress = '0x99156b9128af758848e8eb70b4fda342566c06b3';

// Helper function to safely serialize BigInt values
const safeSerialize = (obj) => {
  return JSON.stringify(obj, (key, value) => {
    // Convert BigInt to string for JSON serialization
    if (typeof value === 'bigint') {
      return value.toString();
    }
    // Convert any potential BigInt numbers returned from Web3
    if (typeof value === 'object' && value !== null && typeof value.toString === 'function' && value._isBigNumber) {
      return value.toString();
    }
    return value;
  });
};

// The base URL for the QR Scanner page - updated to use the provided URL
const QR_SCANNER_BASE_URL = "https://art-chain.vercel.app/";

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [artistName, setArtistName] = useState('');
  const [size, setSize] = useState('');
  const [medium, setMedium] = useState('');
  const [yearCreated, setYearCreated] = useState(new Date().getFullYear());
  const [registeredDateTime, setRegisteredDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [scanUrl, setScanUrl] = useState(''); // New state for scannable URL
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [registrationFee, setRegistrationFee] = useState(0.000001);
  const [networkId, setNetworkId] = useState(null);
  const [productId, setProductId] = useState(null);
  const canvasRef = useRef(null);
  
  // New state for image upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    if (scanUrl && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, scanUrl, {
        errorCorrectionLevel: 'M',
        margin: 1,
        scale: 8,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error(error);
      });

      QRCode.toDataURL(scanUrl, {
        errorCorrectionLevel: 'M',
        margin: 1,
        scale: 8
      }, (err, url) => {
        if (err) console.error(err);
        setQRCodeUrl(url);
      });
    }
  }, [scanUrl]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          const networkId = await web3Instance.eth.net.getId();
          setNetworkId(Number(networkId));
          
          setWeb3(web3Instance);
          setAccount(accounts[0]);

          window.ethereum.on('accountsChanged', (newAccounts) => {
            setAccount(newAccounts[0]);
          });
          
          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          });

          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error("Web3 initialization failed", error);
          if (error.code === 4001) {
            alert("Please connect your MetaMask wallet to use this application");
          } else {
            alert("Error connecting to MetaMask. Please check the console for details.");
          }
        }
      } else {
        alert('Non-Ethereum browser detected. Please install MetaMask!');
      }
    };
    initWeb3();

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageUploadError('');
    
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      setImageName('');
      return;
    }
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setImageUploadError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (limiting to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Image size should be less than 5MB');
      return;
    }
    
    setImageFile(file);
    setImageName(file.name);
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Function to upload image to MongoDB
  const uploadImageToMongoDB = async (productData) => {
    if (!imageFile) return null;
    
    setUploadingImage(true);
    
    try {
      // Convert image file to base64 for storage
      const base64Image = await convertFileToBase64(imageFile);
      
      // Create the payload for MongoDB
      const imageData = {
        productId: productData.productId,
        title: productData.title,
        artist: productData.artist,
        transactionHash: productData.transactionHash,
        image: base64Image,
        fileName: imageName,
        uploadedAt: new Date().toISOString()
      };
      
      // Send to API route that connects to MongoDB
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });
      
      if (!response.ok) {
        throw new Error('Image upload to database failed');
      }
      
      const result = await response.json();
      console.log('Image uploaded to MongoDB:', result);
      return result.imageId;
      
    } catch (error) {
      console.error('Error uploading image to MongoDB:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleTransactionError = (error) => {
    console.log("Transaction error:", error);
    
    setIsSubmitting(false);
    
    if (
      error.code === 4001 || 
      (typeof error.message === 'string' && error.message.includes("User denied transaction")) ||
      (typeof error.message === 'string' && error.message.includes("user rejected"))
    ) {
      console.log("Transaction was cancelled by user");
      return;
    }
    
    if (error.message) {
      if (error.message.includes("Internal JSON-RPC error")) {
        try {
          const errorDetail = JSON.parse(error.message.substring(error.message.indexOf('{')));
          alert(`MetaMask error: ${errorDetail.message || "Unknown internal error"}`);
        } catch {
          alert('Network error. Please verify you are connected to the correct network in MetaMask.');
        }
      } else if (error.message.includes("gas required exceeds allowance")) {
        alert('Transaction requires more gas than allowed. Please increase your gas limit.');
      } else if (error.message.includes("insufficient funds")) {
        alert('Insufficient funds to complete this transaction. Please check your balance.');
      } else {
        alert(`Transaction failed: ${error.message}`);
      }
    } else {
      alert('An unknown error occurred during the transaction.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productName || !description || !artistName || !size || !medium || !yearCreated) {
      alert('Please fill in all required fields');
      return;
    }

    if (!web3 || !contract || !account) {
      alert('Web3 connection not established. Please make sure MetaMask is connected.');
      return;
    }

    setIsSubmitting(true);

    try {
      const feeInWei = web3.utils.toWei(registrationFee.toString(), 'ether');
      
      // Get current product count before adding
      const currentProductCount = await contract.methods.productCount().call();
      
      // Convert BigInt values to strings before use
      const currentProductCountString = String(currentProductCount);
      
      const receipt = await contract.methods.addProduct(
        productName,
        description,
        artistName,
        size,
        medium,
        parseInt(yearCreated)
      ).send({
        from: account,
        value: feeInWei
      })
      .on('error', (error) => {
        throw error;
      })
      .on('transactionHash', (hash) => {
        console.log("Transaction submitted with hash:", hash);
      });

      console.log("Transaction successful:", receipt);
      
      // Set the product ID (it should be the currentProductCount before adding)
      setProductId(currentProductCountString);

      const formattedDate = getCurrentDateTime();
      setRegisteredDateTime(formattedDate);

      // Create product data object
      const productData = {
        productId: currentProductCountString,
        title: productName,
        description: description,
        artist: artistName,
        size: size,
        medium: medium,
        yearCreated: String(yearCreated),
        registeredDate: formattedDate,
        transactionHash: receipt.transactionHash,
        contractAddress: contract.options.address,
        registeredBy: account,
        networkId: networkId ? String(networkId) : "unknown"
      };

      // Upload image to MongoDB if available
      let imageId = null;
      if (imageFile) {
        try {
          imageId = await uploadImageToMongoDB(productData);
          console.log('Image stored in MongoDB with ID:', imageId);
        } catch (error) {
          console.error('Failed to store image in MongoDB:', error);
          alert('Artwork registered on blockchain, but image upload failed. Please try again later.');
        }
      }

      // Add imageId to product data if available
      if (imageId) {
        productData.imageId = imageId;
      }

      // Store full JSON data
      const serializedData = safeSerialize(productData);
      setQRCodeData(serializedData);
      
      // Create a URL for the QR code that points to the provided URL
      // with the data encoded as a query parameter
      const encodedData = encodeURIComponent(serializedData);
      const scannableUrl = `${QR_SCANNER_BASE_URL}?data=${encodedData}`;
      setScanUrl(scannableUrl);
      
      setProductName('');
      setDescription('');
      setArtistName('');
      setSize('');
      setMedium('');
      setYearCreated(new Date().getFullYear());
      setImageFile(null);
      setImagePreview(null);
      setImageName('');
      
      alert('Artwork successfully registered on the blockchain!' + 
           (imageId ? ' Image stored in database.' : ''));
      
    } catch (error) {
      handleTransactionError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return formatDateTimeForDisplay(now);
  };

  const formatDateTimeForDisplay = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      const qrDataObj = JSON.parse(qrCodeData);
      link.download = `${qrDataObj.title || 'ArtCertificate'}.png`;
      link.click();
    }
  };

  // Helper function to safely parse QR code data
  const safeParseQrData = () => {
    try {
      return qrCodeData ? JSON.parse(qrCodeData) : null;
    } catch (error) {
      console.error("Error parsing QR data:", error);
      return null;
    }
  };

  const qrDataObj = safeParseQrData();

  return (
    <div className={styles.container}>
      <Header />
      
      {account && (
        <div className={styles.walletAddress}>
          <MdVerified className={styles.verifiedIcon} />
          Connected Wallet: {account.substring(0, 6)}...{account.substring(account.length - 4)}
          {networkId && <span className={styles.networkBadge}>Network ID: {networkId}</span>}
        </div>
      )}
      
      <div className={styles.formContainer}>
        <h1 className={styles.sectionTitle}>
          Register <span className={styles.highlightText}>Artwork</span>
        </h1>
        
        {/* Form Section - Full Width */}
        <div className={styles.formSection}>
          <div className={styles.card}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="productName" className={styles.formLabel}>Artwork Title</label>
                <input 
                  type="text" 
                  id="productName" 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)} 
                  className={styles.formInput} 
                  placeholder="Enter artwork title"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>Artwork Description</label>
                <textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className={styles.formInput} 
                  placeholder="Describe the artwork"
                  rows="3"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="artistName" className={styles.formLabel}>Artist Name</label>
                <input 
                  type="text" 
                  id="artistName" 
                  value={artistName} 
                  onChange={(e) => setArtistName(e.target.value)} 
                  className={styles.formInput} 
                  placeholder="Enter artist name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="size" className={styles.formLabel}>Artwork Size</label>
                <input 
                  type="text" 
                  id="size" 
                  value={size} 
                  onChange={(e) => setSize(e.target.value)} 
                  className={styles.formInput} 
                  placeholder="e.g., 24x36 inches, 60x90 cm"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="medium" className={styles.formLabel}>Medium</label>
                <input 
                  type="text" 
                  id="medium" 
                  value={medium} 
                  onChange={(e) => setMedium(e.target.value)} 
                  className={styles.formInput} 
                  placeholder="e.g., Oil on canvas, Acrylic, Digital"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="yearCreated" className={styles.formLabel}>Year Created</label>
                <input 
                  type="number" 
                  id="yearCreated" 
                  value={yearCreated} 
                  onChange={(e) => setYearCreated(e.target.value)} 
                  className={styles.formInput} 
                  min="1000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              
              {/* New Image Upload Field */}
              <div className={styles.formGroup}>
                <label htmlFor="artworkImage" className={styles.formLabel}>
                  Artwork Image <span className={styles.optionalText}>(optional)</span>
                </label>
                
                <div className={styles.fileUploadContainer}>
                  <input
                    type="file"
                    id="artworkImage"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                    accept="image/*"
                  />
                  <label htmlFor="artworkImage" className={styles.fileInputLabel}>
                    <FaUpload className={styles.uploadIcon} />
                    {imageName || 'Choose Image'}
                  </label>
                </div>
                
                {imageUploadError && (
                  <p className={styles.errorText}>{imageUploadError}</p>
                )}
                
                {imagePreview && (
                  <div className={styles.imagePreviewContainer}>
                    <img 
                      src={imagePreview} 
                      alt="Artwork preview" 
                      className={styles.imagePreview} 
                    />
                  </div>
                )}
                
                <p className={styles.formHelper}>
                  Image will be stored in database, not on blockchain
                </p>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="registrationFee" className={styles.formLabel}>Registration Fee (ETH)</label>
                <input 
                  type="number" 
                  step="0.000001" 
                  id="registrationFee" 
                  value={registrationFee} 
                  onChange={(e) => setRegistrationFee(parseFloat(e.target.value) || 0)} 
                  className={styles.formInput} 
                />
                <p className={styles.formHelper}>Fee paid to register artwork on blockchain</p>
              </div>
              
              {registeredDateTime && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date & Time Registered</label>
                  <input 
                    type="text" 
                    value={registeredDateTime} 
                    readOnly 
                    className={`${styles.formInput} ${styles.readonlyInput}`} 
                  />
                </div>
              )}
              
              <div className={styles.buttonContainer}>
                <button 
                  type="submit" 
                  className={styles.primaryButton} 
                  disabled={isSubmitting || uploadingImage || !account || !contract}
                >
                  {isSubmitting || uploadingImage ? 'Processing...' : 'Register Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* QR Code Section - Now Below the Form */}
      {qrCodeData && qrDataObj && (
        <div className={styles.qrContainer}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Authentication Certificate</h2>
            
            <div className={styles.qrContentWrapper}>
              <div className={styles.qrCodeContainer}>
                <canvas ref={canvasRef} className={styles.qrCanvas}></canvas>
                <p className={styles.scanInstructions}>Scan with your phone camera</p>
              </div>
              
              <div className={styles.qrDetails}>
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>ID:</span>
                  <span className={styles.qrValue}>{qrDataObj.productId}</span>
                </div>
                
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>Title:</span>
                  <span className={styles.qrValue}>{qrDataObj.title}</span>
                </div>
                
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>Description:</span>
                  <span className={styles.qrValue}>
                    {qrDataObj.description.length > 30 
                      ? qrDataObj.description.substring(0, 30) + '...' 
                      : qrDataObj.description}
                  </span>
                </div>
                
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>Artist:</span>
                  <span className={styles.qrValue}>{qrDataObj.artist}</span>
                </div>
                
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>Size:</span>
                  <span className={styles.qrValue}>{qrDataObj.size}</span>
                </div>
                
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>Medium:</span>
                  <span className={styles.qrValue}>{qrDataObj.medium}</span>
                </div>
                
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>Year Created:</span>
                  <span className={styles.qrValue}>{qrDataObj.yearCreated}</span>
                </div>
                
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>Registered:</span>
                  <span className={styles.qrValue}>{qrDataObj.registeredDate}</span>
                </div>
                
                <div className={styles.qrInfoItem}>
                  <span className={styles.qrLabel}>Transaction:</span>
                  <span className={styles.qrValue}>
                    {qrDataObj.transactionHash.substring(0, 10)}...
                  </span>
                </div>
                
                {qrDataObj.imageId && (
                  <div className={styles.qrInfoItem}>
                    <span className={styles.qrLabel}>Image Stored:</span>
                    <span className={styles.qrValue}>
                      <MdVerified className={styles.verifiedIconSmall} /> Yes
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              className={styles.secondaryButton} 
              onClick={downloadQRCode}
            >
              <FaDownload className={styles.buttonIcon} /> Download QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;