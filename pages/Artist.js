import React, { useEffect, useState } from 'react';
import Header from '../components/Header2';
import { useRouter } from 'next/router';
import { FaList, FaSpinner, FaPaintBrush, FaQrcode, FaHistory } from 'react-icons/fa';
import { MdOutlineAppRegistration, MdVerified, MdSecurity } from 'react-icons/md';
import { SiBlockchaindotcom } from 'react-icons/si';
import { GiArtificialIntelligence } from 'react-icons/gi';
import Image from 'next/image';
import blockchainImage from '../public/images/5.png';
import metaMaskImage from '../public/images/1.png';
import ethereumImage from '../public/images/6.png';
import styles from '../styles/Home.module.css';

// Import the full MoreContent component from the first file
const MoreContent = () => {
  return (
    <div 
      id="moreContent" 
      className={styles.moreContentSection}
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      {/* Remove the black background overlay */}
      {/* Wrap all content in a container with appropriate styling */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 className={styles.sectionTitle}>
          Understanding <span className={styles.highlightText}>Blockchain Technology</span>
        </h2>
        
        <div className={styles.featuresGrid}>
          {/* Blockchain Section */}
          <div className={`${styles.featureCard} ${styles.glassEffect}`}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>
                <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image src={blockchainImage} alt="Blockchain" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <h3 className={styles.featureTitle}>What is blockchain?</h3>
            <p className={styles.featureDescription}>
              Blockchain is a decentralized, distributed ledger technology that securely records transactions across multiple nodes. In Authentithief, blockchain serves as the foundation for creating a transparent and tamper-proof system for product identification and tracking.
            </p>
            <div className={styles.processSteps} style={{ marginTop: '2rem' }}>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Benefits of Authentithief</div>
                <ul className={styles.stepDescription} style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <li>Enhanced security and transparency in product identification</li>
                  <li>Real-time tracking of products through the supply chain</li>
                  <li>Decentralized and secure storage of product information</li>
                  <li>Automation of supply chain events through smart contracts</li>
                </ul>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Key Features</div>
                <ul className={styles.stepDescription} style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <li>User-friendly interface for all stakeholders</li>
                  <li>Blockchain-based authentication and authorization</li>
                  <li>Role-based access control</li>
                  <li>QR code scanner for easy product verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* MetaMask Section */}
          <div className={`${styles.featureCard} ${styles.glassEffect}`}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>
                <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image src={metaMaskImage} alt="MetaMask" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <h3 className={styles.featureTitle}>What is MetaMask?</h3>
            <p className={styles.featureDescription}>
              MetaMask is a cryptocurrency wallet and browser extension that allows users to interact with the Ethereum blockchain. It serves as a bridge between traditional browsers and the decentralized web, enabling users to securely manage their Ethereum-based assets and interact with decentralized applications (DApps).
            </p>
            <div className={styles.processSteps} style={{ marginTop: '2rem' }}>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Purpose of MetaMask</div>
                <p className={styles.stepDescription}>
                  MetaMask provides users with a convenient and secure way to store, send, and receive Ethereum and ERC-20 tokens. It also allows users to access decentralized finance (DeFi) applications, participate in token sales, and interact with smart contracts.
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>How to Use MetaMask</div>
                <ol className={styles.stepDescription} style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <li>Install the MetaMask browser extension</li>
                  <li>Follow the setup instructions</li>
                  <li>Fund your wallet by transferring Ethereum</li>
                  <li>Explore decentralized applications (DApps)</li>
                  <li>Approve transactions and interact with smart contracts</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Ethereum Section */}
          <div className={`${styles.featureCard} ${styles.glassEffect}`}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>
                <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image src={ethereumImage} alt="Ethereum" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <h3 className={styles.featureTitle}>What is Ethereum?</h3>
            <p className={styles.featureDescription}>
              Ethereum is a decentralized platform that enables developers to build and deploy smart contracts and decentralized applications (DApps). It extends the blockchain's capabilities beyond just a cryptocurrency to include programmable code that runs on the Ethereum Virtual Machine (EVM).
            </p>
            <div className={styles.processSteps} style={{ marginTop: '2rem' }}>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Purpose of Ethereum</div>
                <p className={styles.stepDescription}>
                  Ethereum aims to create a more decentralized internet by allowing developers to create and execute smart contracts. These self-executing contracts with the terms of the agreement directly written into code can automate complex transactions and processes, reducing the need for intermediaries.
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Key Features of Ethereum</div>
                <ul className={styles.stepDescription} style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <li>Smart Contracts: Self-executing contracts that automate transactions</li>
                  <li>Decentralized Applications (DApps): Applications that run on a decentralized network</li>
                  <li>Ethereum Virtual Machine (EVM): A runtime environment for smart contracts</li>
                  <li>Ether (ETH): The native cryptocurrency used to pay for transactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <h2 className={styles.sectionTitle} style={{ marginTop: '6rem' }}>
          How It <span className={styles.highlightText}>Works</span>
        </h2>
        
        <div className={styles.processSteps}>
          <div className={`${styles.processStep} ${styles.glassEffect}`}>
            <div className={styles.stepNumber}>1</div>
            <h4 className={styles.stepTitle}>Connect Your Wallet</h4>
            <p className={styles.stepDescription}>Connect your MetaMask wallet to our platform to securely verify your identity and enable transactions.</p>
          </div>
          
          <div className={`${styles.processStep} ${styles.glassEffect}`}>
            <div className={styles.stepNumber}>2</div>
            <h4 className={styles.stepTitle}>Register Product</h4>
            <p className={styles.stepDescription}>Register your product by providing details and creating a unique digital identity on the blockchain.</p>
          </div>
          
          <div className={`${styles.processStep} ${styles.glassEffect}`}>
            <div className={styles.stepNumber}>3</div>
            <h4 className={styles.stepTitle}>Verify Authenticity</h4>
            <p className={styles.stepDescription}>Use our QR code scanner to verify the authenticity of products and track their journey through the supply chain.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
const Home2 = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRegisterProductClick = () => {
    setIsLoading(true);
    setLoadingType("register");

    // Add a delay to show the loading animation
    setTimeout(() => {
      router.push("/add-product");
    }, 800);
  };

  const handleViewProductsClick = () => {
    setIsLoading(true);
    setLoadingType("view");

    // Add a delay to show the loading animation
    setTimeout(() => {
      router.push("/ViewProducts");
    }, 800);
  };

  const handleExploreServicesClick = () => {
    const servicesSection = document.getElementById('services');
    servicesSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Registration features data
  const registrationFeatures = [
    { 
      id: 1, 
      title: "Artwork Registration", 
      description: "Register your artwork on the blockchain with detailed metadata and provenance information",
      icon: <FaPaintBrush className={styles.featureIcon} />
    },
    { 
      id: 2, 
      title: "QR Generation", 
      description: "Generate unique QR codes for your artwork that instantly verify authenticity on the blockchain",
      icon: <FaQrcode className={styles.featureIcon} />
    },
    { 
      id: 3, 
      title: "Provenance Tracking", 
      description: "Complete chronological history of artwork ownership and transfers on an immutable ledger",
      icon: <FaHistory className={styles.featureIcon} />
    },
  ];

  return (
    <div className={styles.container}>
      <Header />
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleHighlight}>Art</span>Chain
          </h1>
          <p className={styles.heroSubtitle}>
            Revolutionizing artwork registry with blockchain technology
          </p>
          <div className={styles.heroButtons}>
            <button
              onClick={handleRegisterProductClick}
              className={styles.primaryButton}
              disabled={isLoading}
              style={{
                transform: isLoading && loadingType === "register" ? "scale(0.98)" : "scale(1)",
              }}
            >
              {isLoading && loadingType === "register" ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  <span style={{ marginLeft: "10px" }}>Loading Form...</span>
                </>
              ) : (
                <>
                  Register Artwork
                  <MdOutlineAppRegistration className={styles.buttonIcon} />
                </>
              )}
            </button>
            <button
              onClick={handleViewProductsClick}
              className={styles.secondaryButton}
              disabled={isLoading}
              style={{
                transform: isLoading && loadingType === "view" ? "scale(0.98)" : "scale(1)",
              }}
            >
              {isLoading && loadingType === "view" ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  <span style={{ marginLeft: "10px" }}>Loading Artworks...</span>
                </>
              ) : (
                <>
                  View Artworks
                  <FaList className={styles.buttonIcon} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Registration Features Section (Our Services) */}
      <div id="services" className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Registration <span className={styles.highlightText}>Features</span></h2>
        <div className={styles.featuresGrid}>
          {registrationFeatures.map((feature) => (
            <div 
              key={feature.id}
              className={`${styles.featureCard} ${activeFeature === feature.id ? styles.activeFeatureCard : ''}`}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className={styles.featureIconContainer}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <div className={styles.featureOverlay}>
                <div className={styles.featureBadge}>
                  <MdVerified style={{color: '#4cff4c', marginRight: '5px'}} />
                  Blockchain Secured
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOVED: MoreContent component is now placed here, after the Registration Features section */}
      <MoreContent />

      {/* Technology Section */}
      <div className={styles.techSection}>
        <h2 className={styles.sectionTitle}>Powered by <span className={styles.highlightText}>Authentithief</span></h2>
        <div className={styles.techIcons}>
          <div className={styles.techItem}>
            <MdVerified className={styles.techIcon} />
            <span className={styles.techLabel}>Certification</span>
          </div>
          <div className={styles.techItem}>
            <SiBlockchaindotcom className={styles.techIcon} />
            <span className={styles.techLabel}>Blockchain</span>
          </div>
          <div className={styles.techItem}>
            <GiArtificialIntelligence className={styles.techIcon} />
            <span className={styles.techLabel}>Smart Registry</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className={styles.footerLogoText}>
              <span className={styles.highlightText}>Art</span>Chain
            </span>
            <p className={styles.footerTagline}>
              Revolutionary artwork registry blockchain technology
            </p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Gallery</a>
            <a href="#" className={styles.footerLink}>Register</a>
            <a href="#" className={styles.footerLink}>Contact</a>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          © {new Date().getFullYear()} ArtChain. All rights reserved.
        </div>
      </footer>
      
      {/* Global styles for animations */}
      <style jsx global>{`
        .spinner-icon {
          animation: spin 1s infinite linear;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .fancy-button {
          overflow: hidden;
          position: relative;
        }

        .fancy-button:before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: all 0.5s ease;
        }

        .fancy-button:hover:before {
          left: 100%;
        }
      `}</style>
    </div>
  );
};

export default Home2;