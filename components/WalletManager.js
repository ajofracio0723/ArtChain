import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { RiWallet3Fill } from 'react-icons/ri';
import Web3 from 'web3';
import styles from '../styles/AddProductForm.module.css';

// Contract ABI definition
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

const contractAddress = '0xbb7feee0219ea8b001d541dafa8acfeb252ee72e';

// MetaMask Installation Component
const MetaMaskInstallation = ({ onInstallClick }) => {
  return (
    <div className={styles.metamaskRequirement}>
      <div className={styles.metamaskCard}>
        <div className={styles.metamaskIconContainer}>
          <img 
            src="/metamask-fox.svg" 
            alt="MetaMask Logo" 
            className={styles.metamaskLogo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://metamask.io/images/metamask-fox.svg";
            }}
          />
        </div>
        <h2 className={styles.metamaskTitle}>MetaMask Required</h2>
        <p className={styles.metamaskDescription}>
          To register artwork on the blockchain, you need to have the MetaMask wallet extension installed
          and connected to this application.
        </p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.metamaskInstallButton}
          onClick={onInstallClick}
        >
          Install MetaMask
        </a>
        <p className={styles.metamaskNote}>
          After installation, please refresh this page and connect your wallet.
        </p>
      </div>
    </div>
  );
};

// Wallet Connection Component
const WalletConnection = ({ onConnectClick, isLoading }) => {
  return (
    <div className={styles.walletConnection}>
      <div className={styles.walletCard}>
        <RiWallet3Fill size={48} className={styles.walletIcon} />
        <h2 className={styles.walletTitle}>Connect Your Wallet</h2>
        <p className={styles.walletDescription}>
          MetaMask is installed! Connect your wallet to register artwork on the blockchain.
        </p>
        <button 
          className={styles.connectWalletButton}
          onClick={onConnectClick}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

const WalletManager = ({ onWalletConnected }) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [networkId, setNetworkId] = useState(null);
  
  // MetaMask status states
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isCheckingMetaMask, setIsCheckingMetaMask] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // Check for MetaMask installation on component mount
  useEffect(() => {
    const checkMetaMaskInstallation = () => {
      const isInstalled = typeof window !== 'undefined' && window.ethereum !== undefined;
      setIsMetaMaskInstalled(isInstalled);
      setIsCheckingMetaMask(false);
      
      if (isInstalled) {
        // Listen for network and account changes
        if (window.ethereum) {
          window.ethereum.on('chainChanged', () => window.location.reload());
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              // User disconnected their wallet
              setAccount('');
              setConnectionError('Wallet disconnected. Please reconnect to continue.');
            } else {
              setAccount(accounts[0]);
              setConnectionError('');
            }
          });
        }
      }
    };
    
    // Small timeout to ensure the browser has fully loaded
    setTimeout(checkMetaMaskInstallation, 500);
    
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Handle MetaMask connection
  const connectToMetaMask = async () => {
    if (!window.ethereum) {
      setConnectionError('MetaMask is not installed. Please install it first.');
      return;
    }
    
    setIsConnecting(true);
    setConnectionError('');
    
    try {
      const web3Instance = new Web3(window.ethereum);
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts available. Please unlock your MetaMask wallet.');
      }
      
      // Get network ID
      const networkId = await web3Instance.eth.net.getId();
      setNetworkId(Number(networkId));
      
      // Initialize Web3 and contract
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
      
      console.log('Successfully connected to MetaMask');
      
      // Call the callback with wallet information
      onWalletConnected({
        web3: web3Instance,
        contract: contractInstance,
        account: accounts[0],
        networkId: Number(networkId)
      });
      
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
      
      if (error.code === 4001) {
        setConnectionError('Connection request rejected. Please approve the connection in MetaMask.');
      } else if (error.message) {
        setConnectionError(`Connection error: ${error.message}`);
      } else {
        setConnectionError('Failed to connect to MetaMask. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle MetaMask installation
  const handleMetaMaskInstall = () => {
    // We can't actually install it for them, but we can track that they clicked
    console.log('User clicked to install MetaMask');
    // Here you could set some analytics event if needed
  };

  // Render function based on MetaMask status
  const renderContent = () => {
    if (isCheckingMetaMask) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Checking for MetaMask installation...</p>
        </div>
      );
    }
    
    if (!isMetaMaskInstalled) {
      return <MetaMaskInstallation onInstallClick={handleMetaMaskInstall} />;
    }
    
    if (!account) {
      return <WalletConnection onConnectClick={connectToMetaMask} isLoading={isConnecting} />;
    }
    
    return (
      <>
        {account && (
          <div className={styles.walletAddress}>
            <MdVerified className={styles.verifiedIcon} />
            Connected Wallet: {account.substring(0, 6)}...{account.substring(account.length - 4)}
            {networkId && <span className={styles.networkBadge}>Network ID: {networkId}</span>}
          </div>
        )}
        
        {connectionError && (
          <div className={styles.connectionError}>
            <FaExclamationTriangle className={styles.errorIcon} />
            {connectionError}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.walletManagerContainer}>
      {renderContent()}
    </div>
  );
};

export default WalletManager;