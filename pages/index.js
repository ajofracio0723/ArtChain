import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { FaEthereum, FaCubes, FaQrcode, FaHistory, FaBars, FaTimes } from 'react-icons/fa';
import { MdVerified, MdSecurity } from 'react-icons/md';
import { SiSolidity } from 'react-icons/si';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    
    // Add event listener for window resize
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  const handleQRScannerClick = () => {
    router.push('/qrscanner');
  };

  const handleLearnMoreClick = () => {
    const featuresSection = document.getElementById('features');
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const features = [
    { 
      id: 1, 
      title: "Scan & Verify", 
      icon: <FaQrcode className={styles.featureIcon} />,
      description: "Instantly authenticate artwork with our QR scanning technology linked to blockchain records" 
    },
    { 
      id: 2, 
      title: "Provenance Tracking", 
      icon: <FaHistory className={styles.featureIcon} />,
      description: "View complete ownership history and transfer records secured on the blockchain" 
    },
    { 
      id: 3, 
      title: "Tamper-Proof Certificates", 
      icon: <MdSecurity className={styles.featureIcon} />,
      description: "Cryptographically secured certificates that cannot be forged or altered" 
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <Header />
      
      </div>
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleHighlight}>Art</span>Chain
          </h1>
          <p className={styles.heroSubtitle}>
            Authentication reimagined through blockchain technology
          </p>
          <div className={styles.heroButtons}>
            <button
              onClick={handleQRScannerClick}
              className={styles.primaryButton}
            >
              Authenticate Artwork
              <MdVerified className={styles.buttonIcon} />
            </button>
            <button
              onClick={handleLearnMoreClick}
              className={styles.secondaryButton}
            >
              Explore 
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Our <span className={styles.highlightText}>Services</span></h2>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
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

      {/* Technology Section */}
      <div className={styles.techSection}>
        <h2 className={styles.sectionTitle}>Powered by <span className={styles.highlightText}>Authentithief</span></h2>
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
            <SiSolidity className={styles.techIcon} />
            <span className={styles.techLabel}>Smart Contracts</span>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className={styles.footerLogoText}>
              <span className={styles.highlightText}>Art</span>Chain
            </span>
            <p className={styles.footerTagline}>
              Authenticating art through blockchain technology
            </p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Gallery</a>
            <a href="#" className={styles.footerLink}>Artists</a>
            <a href="#" className={styles.footerLink}>Contact</a>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          © {new Date().getFullYear()} ArtChain. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;