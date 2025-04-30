import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header2';
import { FaDownload } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import Web3 from 'web3';
import QRCode from 'qrcode';
import styles from '../styles/AddProductForm.module.css';

// Unchanged contract ABI
const contractABI = [
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_artist", type: "string" },
      { internalType: "string", name: "_size", type: "string" },
      { internalType: "string", name: "_price", type: "string" }
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
          { internalType: "string", name: "artist", type: "string" },
          { internalType: "string", name: "size", type: "string" },
          { internalType: "string", name: "price", type: "string" }
        ],
        internalType: "struct ProductRegistry.Product[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const contractAddress = '0x6Cec02D6AEe75e7e5604c9bbCe3c7560ed4af364';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [registeredDateTime, setRegisteredDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [registrationFee, setRegistrationFee] = useState(0.000001);
  const [networkId, setNetworkId] = useState(null);
  const canvasRef = useRef(null);

  // Generate QR code when data changes
  useEffect(() => {
    if (qrCodeData && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrCodeData, {
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

      // Also generate a data URL for download
      QRCode.toDataURL(qrCodeData, {
        errorCorrectionLevel: 'M',
        margin: 1,
        scale: 8
      }, (err, url) => {
        if (err) console.error(err);
        setQRCodeUrl(url);
      });
    }
  }, [qrCodeData]);

  // Web3 initialization
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          // Request account access
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          // Get current network ID
          const networkId = await web3Instance.eth.net.getId();
          // Convert networkId to a regular number to avoid BigInt serialization issues
          setNetworkId(Number(networkId));
          
          setWeb3(web3Instance);
          setAccount(accounts[0]);

          // Set up listeners for account and network changes
          window.ethereum.on('accountsChanged', (newAccounts) => {
            setAccount(newAccounts[0]);
          });
          
          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload(); // Recommended by MetaMask docs to reload on chain change
          });

          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error("Web3 initialization failed", error);
          if (error.code === 4001) {
            // User rejected request
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

    // Cleanup function to remove event listeners
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !artistName || !size || !price) {
      alert('Please fill in all required fields');
      return;
    }

    if (!web3 || !contract || !account) {
      alert('Web3 connection not established. Please make sure MetaMask is connected.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert registration fee from ETH to Wei
      const feeInWei = web3.utils.toWei(registrationFee.toString(), 'ether');
      
      // Make a direct contract call instead of estimating gas
      const receipt = await contract.methods.addProduct(
        productName,
        artistName,
        size,
        price
      ).send({
        from: account,
        value: feeInWei,
        // Let MetaMask handle the gas estimation automatically
      });

      console.log("Transaction successful:", receipt);

      // Update UI with successful registration
      const formattedDate = getCurrentDateTime();
      setRegisteredDateTime(formattedDate);

      // Make sure all values are JSON-serializable (convert any BigInt to string or number)
      const qrData = {
        title: productName,
        artist: artistName,
        size: size,
        price: `${price} PHP`,
        registeredDate: formattedDate,
        transactionHash: receipt.transactionHash,
        contractAddress: contract.options.address,
        registeredBy: account,
        networkId: networkId ? String(networkId) : "unknown" // Convert networkId to string
      };

      // Now stringify the data with all safe values
      setQRCodeData(JSON.stringify(qrData));
      
      // Reset form
      setProductName('');
      setArtistName('');
      setSize('');
      setPrice('');
      
      alert('Artwork successfully registered on the blockchain!');
      
    } catch (error) {
      console.error("Transaction error:", error);
      handleTransactionError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Improved error handling
  const handleTransactionError = (error) => {
    if (error.code === 4001) {
      alert('Transaction was rejected by user.');
    } else if (error.message && error.message.includes("Internal JSON-RPC error")) {
      // Parse the internal error if possible
      try {
        const errorDetail = JSON.parse(error.message.substring(error.message.indexOf('{')));
        alert(`MetaMask RPC error: ${errorDetail.message || "Unknown internal error"}`);
      } catch {
        // Check if we're on the correct network
        alert('RPC error occurred. Please verify you are connected to the correct network in MetaMask and that you have sufficient funds for gas fees.');
      }
    } else if (error.message && error.message.includes("gas required exceeds allowance")) {
      alert('Transaction requires more gas than allowed. You may need to increase your gas limit in MetaMask.');
    } else if (error.message && error.message.includes("insufficient funds")) {
      alert('Insufficient funds to complete this transaction. Please check your account balance.');
    } else {
      alert(`Transaction failed: ${error.message || "Unknown error"}`);
    }
  };

  // Helper functions
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
      link.download = `${JSON.parse(qrCodeData).title || 'ArtCertificate'}.png`;
      link.click();
    }
  };

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
        
        <div className={styles.contentGrid}>
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
                  <label htmlFor="price" className={styles.formLabel}>Artwork Price (PHP)</label>
                  <input 
                    type="text" 
                    id="price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className={styles.formInput} 
                    placeholder="Enter price in PHP"
                    required
                  />
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
                    disabled={isSubmitting || !account || !contract}
                  >
                    {isSubmitting ? 'Processing...' : 'Register Artwork'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {qrCodeData && (
            <div className={styles.qrSection}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Authentication Certificate</h2>
                
                <div className={styles.qrCodeContainer}>
                  <canvas ref={canvasRef} className={styles.qrCanvas}></canvas>
                </div>
                
                <div className={styles.qrDetails}>
                  <div className={styles.qrInfoItem}>
                    <span className={styles.qrLabel}>Title:</span>
                    <span className={styles.qrValue}>{JSON.parse(qrCodeData).title}</span>
                  </div>
                  
                  <div className={styles.qrInfoItem}>
                    <span className={styles.qrLabel}>Artist:</span>
                    <span className={styles.qrValue}>{JSON.parse(qrCodeData).artist}</span>
                  </div>
                  
                  <div className={styles.qrInfoItem}>
                    <span className={styles.qrLabel}>Size:</span>
                    <span className={styles.qrValue}>{JSON.parse(qrCodeData).size}</span>
                  </div>
                  
                  <div className={styles.qrInfoItem}>
                    <span className={styles.qrLabel}>Price:</span>
                    <span className={styles.qrValue}>{JSON.parse(qrCodeData).price}</span>
                  </div>
                  
                  <div className={styles.qrInfoItem}>
                    <span className={styles.qrLabel}>Registered:</span>
                    <span className={styles.qrValue}>{JSON.parse(qrCodeData).registeredDate}</span>
                  </div>
                  
                  <div className={styles.qrInfoItem}>
                    <span className={styles.qrLabel}>Transaction:</span>
                    <span className={styles.qrValue}>
                      {JSON.parse(qrCodeData).transactionHash.substring(0, 10)}...
                    </span>
                  </div>
                </div>
                
                <button 
                  className={styles.secondaryButton} 
                  onClick={downloadQRCode}
                >
                  <FaDownload className={styles.buttonIcon} /> Download Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;