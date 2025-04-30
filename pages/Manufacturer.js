import React, { useEffect, useState } from 'react';
import Header from '../components/Header2';
import { useRouter } from 'next/router';
import { FaList, FaSpinner } from 'react-icons/fa';
import { MdOutlineAppRegistration, MdVerified } from 'react-icons/md';
import { SiBlockchaindotcom } from 'react-icons/si';
import Image from 'next/image';
import MoreContent from './MoreContent';
import styles from '../styles/Home.module.css';

const Home2 = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
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

  const handleLearnMoreClick = () => {
    const moreContentSection = document.getElementById('moreContent');
    moreContentSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Sample products data - replace with actual data and images
  const products = [
    { 
      id: 1, 
      title: "Authentication System", 
      description: "Secure blockchain verification for authentic product origin",
      // Replace with actual image import
      image: "/images/authentication.jpg" 
    },
    { 
      id: 2, 
      title: "Digital Certificates", 
      description: "Cryptographically signed certificates of authenticity",
      // Replace with actual image import
      image: "/images/certificate.jpg" 
    },
    { 
      id: 3, 
      title: "Ownership Registry", 
      description: "Transparent record of product ownership and transfers",
      // Replace with actual image import
      image: "/images/registry.jpg" 
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
            Revolutionizing anti-counterfeit with blockchain technology
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
                  Register Product
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
                  <span style={{ marginLeft: "10px" }}>Loading Products...</span>
                </>
              ) : (
                <>
                  View artworks
                  <FaList className={styles.buttonIcon} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Featured <span className={styles.highlightText}>Products</span></h2>
        <div className={styles.gallery}>
          {products.map((product) => (
            <div 
              key={product.id}
              className={`${styles.galleryItem} ${activeProject === product.id ? styles.activeGalleryItem : ''}`}
              onMouseEnter={() => setActiveProject(product.id)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className={styles.imageContainer}>
                {/* If you have actual images, use this Image component */}
                {/* <Image 
                  src={product.image} 
                  alt={product.title} 
                  className={styles.galleryImage}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                /> */}
                
                {/* Placeholder for image */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, #1a0938 0%, #000000 100%)`,
                }}></div>
                
                <div className={styles.imageOverlay}>
                  <div className={styles.verifiedBadge}>
                    <MdVerified style={{color: '#4cff4c', marginRight: '5px'}} />
                    Verified
                  </div>
                </div>
              </div>
              <div className={styles.galleryItemContent}>
                <h3 className={styles.galleryItemTitle}>{product.title}</h3>
                <p className={styles.galleryItemDesc}>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className={styles.techSection}>
        <h2 className={styles.sectionTitle}>Powered by <span className={styles.highlightText}>Blockchain</span></h2>
        <div className={styles.techIcons}>
          <div className={styles.techItem}>
            <MdVerified className={styles.techIcon} />
            <span className={styles.techLabel}>Verification</span>
          </div>
          <div className={styles.techItem}>
            <SiBlockchaindotcom className={styles.techIcon} />
            <span className={styles.techLabel}>Blockchain</span>
          </div>
          <div className={styles.techItem}>
            <MdOutlineAppRegistration className={styles.techIcon} />
            <span className={styles.techLabel}>Registration</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className={styles.footerLogoText}>
              <span className={styles.highlightText}>AUTHENTI</span>THIEF
            </span>
            <p className={styles.footerTagline}>
              Revolutionary anti-counterfeit blockchain technology
            </p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Products</a>
            <a href="#" className={styles.footerLink}>Register</a>
            <a href="#" className={styles.footerLink}>Contact</a>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          © {new Date().getFullYear()} Authentithief. All rights reserved.
        </div>
      </footer>
      
      {/* More Content Section */}
      <div id="moreContent">
        <MoreContent />
      </div>
      
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