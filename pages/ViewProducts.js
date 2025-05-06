import React, { useState, useEffect } from 'react';
import Header from '../components/Header2';
import Web3 from 'web3';
import styles from '../styles/ViewProducts.module.css';
import { CheckCircle, Search, Filter, ChevronRight, User, Grid, List, X, ArrowLeft } from 'lucide-react';

// Updated contract ABI to match your Solidity contract
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
          { internalType: "string", name: "artist", type: "string" },
          { internalType: "string", name: "size", type: "string" }
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
          { internalType: "string", name: "artist", type: "string" },
          { internalType: "string", name: "size", type: "string" }
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
      { internalType: "string", name: "_artist", type: "string" },
      { internalType: "string", name: "_size", type: "string" }
    ],
    name: "addProduct",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];

const contractAddress = '0x1d0eae7e912237c982750485aa9ca0443c2588d5';

// Product Details Modal Component
const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;
  
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

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
          await loadProducts(contractInstance, accounts[0]);
        } catch (error) {
          console.error("Web3 initialization failed", error);
          alert("Please install MetaMask and connect your wallet");
        } finally {
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
    if (contract && account) {
      loadProducts(contract, account);
    }
  }, [ownerView, contract, account]);

  const loadProducts = async (contractInstance, currentAccount) => {
    try {
      setLoading(true);
      
      let loadedProducts = [];
      
      if (ownerView) {
        // Load only products owned by the current user
        const ownerProducts = await contractInstance.methods.getProductsByOwner(currentAccount).call();
        loadedProducts = ownerProducts;
      } else {
        // Load all products with pagination
        const totalProducts = await contractInstance.methods.getTotalProducts().call();
        const batchSize = 20;
        
        for (let i = 0; i < totalProducts; i += batchSize) {
          const batch = await contractInstance.methods.getProductsPaginated(i, batchSize).call();
          loadedProducts.push(...batch);
        }
      }
      
      setProducts(loadedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
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

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.size.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            >
              <Grid size={18} />
              All Artworks
            </button>
            <button 
              className={`${styles.viewButton} ${ownerView ? styles.activeViewButton : ''}`}
              onClick={() => setOwnerView(true)}
            >
              <User size={18} />
              My Artworks
            </button>
          </div>
          
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.displayToggle}>
            <button 
              className={`${styles.displayButton} ${viewMode === 'grid' ? styles.activeDisplayButton : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button 
              className={`${styles.displayButton} ${viewMode === 'list' ? styles.activeDisplayButton : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.pulseCircle}></div>
            <p className={styles.loadingText}>Loading artworks...</p>
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
                      <span className={styles.detailLabel}>Size:</span>
                      <span className={styles.detailValue}>{product.size}</span>
                    </div>
                  </div>
                  <div className={styles.verifiedBadge}>
                    <CheckCircle size={14} className={styles.verifyIcon} />
                    Blockchain Record
                  </div>
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
            <button className={styles.primaryButton} onClick={handleRegisterArtwork}>Register a New Artwork</button>
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