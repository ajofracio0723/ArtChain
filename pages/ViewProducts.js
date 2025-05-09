import React, { useState, useEffect } from 'react';
import Header from '../components/Header2';
import Web3 from 'web3';
import styles from '../styles/ViewProducts.module.css';
import { CheckCircle, Search, Filter, ChevronRight, User, Grid, List, X, ArrowLeft, AlertTriangle, Calendar, Book, PaintBucket } from 'lucide-react';

// Updated contract ABI to match your full Solidity contract
const contractABI = [
  {
    inputs: [],
    name: "getTotalProducts",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
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
      { internalType: "address", name: "_owner", type: "address" }
    ],
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
      { internalType: "uint256", name: "_productId", type: "uint256" }
    ],
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
    name: "getContractBalance",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
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
  }
];

const contractAddress = '0x99156b9128af758848e8eb70b4fda342566c06b3';
const EXPECTED_NETWORK_ID = '11155111'; // Ethereum Sepolia Network ID
const EXPECTED_NETWORK_NAME = 'Sepolia Test Network';

// Product Details Modal Component
const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;
  
  // Format owner address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <X size={24} />
          </button>
          <h2 className={styles.modalTitle}>{product.title}</h2>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.productImagePlaceholder}>
            <div className={styles.placeholderText}>Artwork Image</div>
          </div>
          
          <div className={styles.modalProductDetails}>
            <div className={styles.modalDetailSection}>
              <h3 className={styles.modalDetailTitle}>Artwork Details</h3>
              
              <div className={styles.modalDetailItem}>
                <span className={styles.modalDetailLabel}>Artist</span>
                <span className={styles.modalDetailValue}>{product.artist}</span>
              </div>
              
              <div className={styles.modalDetailItem}>
                <span className={styles.modalDetailLabel}>Size</span>
                <span className={styles.modalDetailValue}>{product.size}</span>
              </div>

              <div className={styles.modalDetailItem}>
                <span className={styles.modalDetailLabel}>Medium</span>
                <span className={styles.modalDetailValue}>{product.medium || 'N/A'}</span>
              </div>

              <div className={styles.modalDetailItem}>
                <span className={styles.modalDetailLabel}>Year Created</span>
                <span className={styles.modalDetailValue}>{product.yearCreated ? product.yearCreated.toString() : 'N/A'}</span>
              </div>

              <div className={styles.modalDetailItem}>
                <span className={styles.modalDetailLabel}>Owner</span>
                <span className={styles.modalDetailValue}>{formatAddress(product.owner)}</span>
              </div>
            </div>
            
            <div className={styles.modalDetailSection}>
              <h3 className={styles.modalDetailTitle}>Description</h3>
              <p className={styles.modalDescription}>
                {product.description || 'No description available.'}
              </p>
            </div>
            
            <div className={styles.modalDetailSection}>
              <h3 className={styles.modalDetailTitle}>Blockchain Verification</h3>
              
              <div className={styles.verificationBadge}>
                <CheckCircle size={16} className={styles.verifyIcon} />
                <span>Verified on Blockchain</span>
              </div>
              
              <p className={styles.modalDescription}>
                This artwork has been registered on the blockchain, ensuring its authenticity and provenance. 
                The digital certificate is immutable and provides a permanent record of ownership.
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.modalBackButton} onClick={onClose}>
            <ArrowLeft size={16} />
            Back to Gallery
          </button>
          <button className={styles.modalPrimaryButton}>
            View Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [ownerView, setOwnerView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [currentNetworkId, setCurrentNetworkId] = useState(null);
  const [filterMedium, setFilterMedium] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Check if the current network is the expected one
  const checkNetwork = async (web3Instance) => {
    try {
      const networkId = await web3Instance.eth.net.getId();
      setCurrentNetworkId(networkId.toString());
      return networkId.toString() === EXPECTED_NETWORK_ID;
    } catch (error) {
      console.error("Error checking network:", error);
      return false;
    }
  };

  // Handle network switch
  const handleSwitchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Request switch to Sepolia network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + parseInt(EXPECTED_NETWORK_ID).toString(16) }],
        });
        
        // Refresh the page after switch
        window.location.reload();
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x' + parseInt(EXPECTED_NETWORK_ID).toString(16),
                  chainName: EXPECTED_NETWORK_NAME,
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                },
              ],
            });
            // Refresh the page after adding the network
            window.location.reload();
          } catch (addError) {
            console.error("Error adding Sepolia network:", addError);
          }
        } else {
          console.error("Error switching to Sepolia network:", switchError);
        }
      }
    }
  };

  // Listen for network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain
        // Recommended: reload the page, unless you have a good reason not to
        window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        try {
          await window.ethereum.enable();
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          // Check if we're on the correct network
          const isCorrectNetwork = await checkNetwork(web3Instance);
          setNetworkError(!isCorrectNetwork);

          if (isCorrectNetwork) {
            const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
            setContract(contractInstance);
            await loadProducts(contractInstance, accounts[0]);
          } else {
            // If we're on the wrong network, still set loading to false
            setLoading(false);
          }
        } catch (error) {
          console.error("Web3 initialization failed", error);
          if (error.message.includes("User denied account authorization")) {
            alert("Please connect your MetaMask wallet to use this application");
          } else {
            alert("Error connecting to blockchain. Please check your connection and try again.");
          }
          setLoading(false);
        }
      } else {
        alert('Non-Ethereum browser detected. Please install MetaMask!');
        setLoading(false);
      }
    };
    initWeb3();
  }, []);

  // Effect for loading products when ownerView changes
  useEffect(() => {
    if (contract && account && !networkError) {
      loadProducts(contract, account);
    }
  }, [ownerView, contract, account, networkError]);

  const loadProducts = async (contractInstance, currentAccount) => {
    try {
      setLoading(true);
      
      let loadedProducts = [];
      
      if (ownerView) {
        // Load only products owned by the current user
        const ownerProducts = await contractInstance.methods.getProductsByOwner(currentAccount).call();
        loadedProducts = ownerProducts.filter(product => product.exists); // Filter out deleted products
      } else {
        // Load all products with pagination
        const totalProducts = await contractInstance.methods.getTotalProducts().call();
        const batchSize = 20;
        
        for (let i = 0; i < totalProducts; i += batchSize) {
          const batch = await contractInstance.methods.getProductsPaginated(i, batchSize).call();
          // Filter out deleted products
          const validProducts = batch.filter(product => product.exists);
          loadedProducts.push(...validProducts);
        }
      }
      
      setProducts(loadedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      // Check if the error is due to wrong network
      if (error.message.includes("Returned values aren't valid") || 
          error.message.includes("out of gas") ||
          error.message.includes("invalid address")) {
        setNetworkError(true);
      }
      setLoading(false);
    }
  };

  // Open modal with selected product
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };

  // Handler for registering new artwork
  const handleRegisterArtwork = () => {
    // Navigate to registration page
    window.location.href = '/register-product';
  };

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterMedium('');
    setFilterYear('');
    setIsFilterOpen(false);
  };

  // Get unique medium values from products
  const getMediums = () => {
    const mediums = [...new Set(products.map(product => product.medium))];
    return mediums.filter(medium => medium); // Remove empty values
  };

  // Get unique years from products
  const getYears = () => {
    const years = [...new Set(products.map(product => product.yearCreated ? parseInt(product.yearCreated) : null))];
    return years.filter(year => year); // Remove null values
  };

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    // Search term filter
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Medium filter
    const matchesMedium = !filterMedium || product.medium === filterMedium;
    
    // Year filter
    const matchesYear = !filterYear || (product.yearCreated && product.yearCreated.toString() === filterYear);
    
    return matchesSearch && matchesMedium && matchesYear;
  });

  return (
    <div className={styles.container}>
      <Header />
      
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Art <span className={styles.heroTitleHighlight}>Registry</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Browse all registered artworks on the blockchain
          </p>
          
          {account && (
            <div className={styles.walletBadge}>
              <div className={styles.walletIcon}></div>
              {account.substring(0, 6)}...{account.substring(account.length - 4)}
              {currentNetworkId && currentNetworkId !== EXPECTED_NETWORK_ID && (
                <span className={styles.wrongNetworkIndicator}>Wrong Network</span>
              )}
            </div>
          )}
        </div>
      </section>
      
      <section className={styles.productSection}>
        <div className={styles.productControls}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewButton} ${!ownerView ? styles.activeViewButton : ''}`}
              onClick={() => setOwnerView(false)}
              disabled={networkError}
            >
              <Grid size={18} />
              All Artworks
            </button>
            <button 
              className={`${styles.viewButton} ${ownerView ? styles.activeViewButton : ''}`}
              onClick={() => setOwnerView(true)}
              disabled={networkError}
            >
              <User size={18} />
              My Artworks
            </button>
          </div>
          
          <div className={styles.searchFilterContainer}>
            <div className={styles.searchContainer}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={networkError}
              />
            </div>
            
            <button 
              className={`${styles.filterButton} ${isFilterOpen ? styles.activeFilterButton : ''}`}
              onClick={toggleFilterPanel}
              disabled={networkError}
            >
              <Filter size={18} />
              Filter
            </button>
          </div>
          
          <div className={styles.displayToggle}>
            <button 
              className={`${styles.displayButton} ${viewMode === 'grid' ? styles.activeDisplayButton : ''}`}
              onClick={() => setViewMode('grid')}
              disabled={networkError}
            >
              <Grid size={18} />
            </button>
            <button 
              className={`${styles.displayButton} ${viewMode === 'list' ? styles.activeDisplayButton : ''}`}
              onClick={() => setViewMode('list')}
              disabled={networkError}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        
        {/* Filter Panel */}
        {isFilterOpen && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Medium</label>
              <select 
                className={styles.filterSelect}
                value={filterMedium}
                onChange={(e) => setFilterMedium(e.target.value)}
              >
                <option value="">All Mediums</option>
                {getMediums().map((medium, index) => (
                  <option key={index} value={medium}>{medium}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Year Created</label>
              <select 
                className={styles.filterSelect}
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {getYears().sort((a, b) => b - a).map((year, index) => (
                  <option key={index} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button className={styles.resetFilterButton} onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.pulseCircle}></div>
            <p className={styles.loadingText}>Loading artworks...</p>
          </div>
        ) : networkError ? (
          <div className={styles.networkErrorContainer}>
            <AlertTriangle size={48} className={styles.errorIcon} />
            <h3 className={styles.errorTitle}>Network Error</h3>
            <p className={styles.errorDescription}>
              Unable to connect to the Art Registry contract. The contract is deployed on {EXPECTED_NETWORK_NAME}.
            </p>
            <p className={styles.errorInfo}>
              Current Network: {currentNetworkId ? `ID: ${currentNetworkId}` : 'Unknown'}
            </p>
            <button 
              className={styles.primaryButton}
              onClick={handleSwitchNetwork}
            >
              Switch to Sepolia Network
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' ? styles.productsGrid : styles.productsList}>
            {filteredProducts.map((product, index) => (
              <div key={index} className={styles.productItem}>
                <div className={styles.productContent}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <div className={styles.productDetails}>
                    <div className={styles.productDetail}>
                      <span className={styles.detailLabel}>Artist:</span>
                      <span className={styles.detailValue}>{product.artist}</span>
                    </div>
                    
                    <div className={styles.productDetail}>
                      <span className={styles.detailLabel}>Medium:</span>
                      <span className={styles.detailValue}>{product.medium || 'N/A'}</span>
                    </div>
                    
                    <div className={styles.productDetail}>
                      <span className={styles.detailLabel}>Size:</span>
                      <span className={styles.detailValue}>{product.size}</span>
                    </div>
                    
                    <div className={styles.productDetail}>
                      <span className={styles.detailLabel}>Year:</span>
                      <span className={styles.detailValue}>{product.yearCreated ? product.yearCreated.toString() : 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Product Tags */}
                  <div className={styles.productTags}>
                    <div className={styles.verifiedBadge}>
                      <CheckCircle size={14} className={styles.verifyIcon} />
                      Blockchain Record
                    </div>
                
                  </div>
                  
                  {product.description && viewMode === 'list' && (
                    <p className={styles.listItemDescription}>
                      {product.description.length > 120 
                        ? product.description.substring(0, 120) + '...' 
                        : product.description}
                    </p>
                  )}
                </div>
                
                <button 
                  className={styles.productButton}
                  onClick={() => handleViewDetails(product)}
                >
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>{ownerView ? "You haven't registered any artworks yet." : "No artworks found in the registry."}</p>
            <button 
              className={styles.primaryButton} 
              onClick={handleRegisterArtwork}
              disabled={networkError}
            >
              Register a New Artwork
            </button>
          </div>
        )}
      </section>
      
      {/* Product Details Modal */}
      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>
            <div className={styles.footerLogo}>
              <h3 className={styles.footerLogoText}>
                Art<span className={styles.highlightText}>Registry</span>
              </h3>
              <p className={styles.footerTagline}>Secure blockchain verification for authentic artworks</p>
            </div>
          </div>
          
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Features</a>
            <a href="#" className={styles.footerLink}>Register</a>
            <a href="#" className={styles.footerLink}>Verify</a>
            <a href="#" className={styles.footerLink}>Contact</a>
          </div>
        </div>
        
        <div className={styles.footerCopyright}>
          © {new Date().getFullYear()} Art Registry. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ViewProducts;