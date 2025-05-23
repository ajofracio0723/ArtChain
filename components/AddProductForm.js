import React, { useState, useEffect } from 'react';
import Header from '../components/Header2';
import { FaUpload } from 'react-icons/fa';
import QRCodeCertificate from '../components/QRCodeCertificate';
import WalletManager from './WalletManager';
import styles from '../styles/AddProductForm.module.css';

// The base URL for the QR Scanner page
const QR_SCANNER_BASE_URL = "https://art-chain.vercel.app/";

// Define the maximum file size in bytes (800KB = 800 * 1024 bytes)
const MAX_FILE_SIZE = 800 * 1024;

// OP Mainnet Network Configuration
const OP_MAINNET = {
  chainId: '0xA', // Chain ID for OP Mainnet in hex (decimal: 10)
  chainName: 'OP Mainnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.optimism.io'],
  blockExplorerUrls: ['https://optimistic.etherscan.io']
};

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
  const [scanUrl, setScanUrl] = useState('');
  const [registrationFee, setRegistrationFee] = useState(0.000001);
  const [productId, setProductId] = useState(null);
  
  // Wallet connection states
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [networkId, setNetworkId] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [networkSwitchInProgress, setNetworkSwitchInProgress] = useState(false);
  
  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [imageName, setImageName] = useState('');

  // Check if connected to the correct network
  useEffect(() => {
    if (networkId) {
      // OP Mainnet has chainId 10
      setIsCorrectNetwork(networkId === 10);
    }
  }, [networkId]);

  // Handler for wallet connection
  const handleWalletConnected = ({ web3, contract, account, networkId }) => {
    setWeb3(web3);
    setContract(contract);
    setAccount(account);
    setNetworkId(networkId);
  };

  // Function to switch network to OP Mainnet
  const switchToOpMainnet = async () => {
    if (!window.ethereum || !web3) {
      alert('MetaMask is not installed. Please install MetaMask to use this feature.');
      return;
    }

    setNetworkSwitchInProgress(true);
    
    try {
      // First try to switch to OP Mainnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: OP_MAINNET.chainId }],
      });
    } catch (switchError) {
      // If the network doesn't exist in MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [OP_MAINNET],
          });
        } catch (addError) {
          console.error('Error adding OP Mainnet network to MetaMask:', addError);
          alert('Failed to add OP Mainnet to MetaMask. Please add it manually.');
        }
      } else {
        console.error('Error switching to OP Mainnet:', switchError);
        alert('Failed to switch network. Please manually switch to OP Mainnet in MetaMask.');
      }
    } finally {
      setNetworkSwitchInProgress(false);
    }
  };

  // Helper function to convert KB to a readable format
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

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
    
    // Validate file size (limiting to 800KB)
    if (file.size > MAX_FILE_SIZE) {
      setImageUploadError(`Image size should be less than 800KB. Your file is ${formatFileSize(file.size)}.`);
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
    
    if (!account) {
      alert('Please connect your MetaMask wallet first.');
      return;
    }
    
    if (!isCorrectNetwork) {
      alert('Please switch to OP Mainnet network before registering artwork.');
      return;
    }
    
    if (!productName || !description || !artistName || !size || !medium || !yearCreated) {
      alert('Please fill in all required fields');
      return;
    }

    if (!web3 || !contract) {
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

  // Render network warning banner if not on correct network
  const renderNetworkWarning = () => {
    if (!account) return null;
    
    if (!isCorrectNetwork) {
      return (
        <div className={styles.networkWarning}>
          <p>
            <strong>Warning:</strong> You are not connected to OP Mainnet. 
            This application requires OP Mainnet (Optimism) network.
          </p>
          <button 
            onClick={switchToOpMainnet} 
            className={styles.switchNetworkButton}
            disabled={networkSwitchInProgress}
          >
            {networkSwitchInProgress ? 'Switching...' : 'Switch to OP Mainnet'}
          </button>
        </div>
      );
    }
    
    return null;
  };

  // Render the form
  const renderForm = () => {
    return (
      <div className={styles.formSection}>
        <div className={styles.card}>
          {renderNetworkWarning()}
          
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
            
            {/* Image Upload Field with 800KB limit */}
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
                Image will be stored in database, not on blockchain. Maximum size: 800KB.
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
                disabled={isSubmitting || uploadingImage || !account || !contract || !isCorrectNetwork}
              >
                {isSubmitting || uploadingImage ? 'Processing...' : 'Register Artwork'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Header />
      
      {/* WalletManager component to handle wallet connection */}
      <WalletManager onWalletConnected={handleWalletConnected} />
      
      {account && (
        <div className={styles.formContainer}>
          <h1 className={styles.sectionTitle}>
            Register <span className={styles.highlightText}>Artwork</span>
          </h1>
          
          {/* Form Section - Full Width */}
          {renderForm()}
        </div>
      )}
      
      {/* QR Code Certificate Component */}
      {qrCodeData && (
        <QRCodeCertificate 
          qrCodeData={qrCodeData} 
          scanUrl={scanUrl} 
        />
      )}
    </div>
  );
};

export default AddProductForm;