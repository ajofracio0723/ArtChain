import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { FaEthereum, FaCubes } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { SiSolidity } from 'react-icons/si';
import Image from 'next/image';
import landingImage from '../public/images/1.png';
import image2 from '../public/images/2.png';
import image3 from '../public/images/3.png';
import MoreContent from './MoreContent';
import styles from '../styles/Home.module.css';

const Home = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleQRScannerClick = () => {
    router.push('/qrscanner');
  };

  const handleLearnMoreClick = () => {
    const moreContentSection = document.getElementById('moreContent');
    moreContentSection.scrollIntoView({ behavior: 'smooth' });
  };

  const projects = [
    { id: 1, title: "Authenticated Origin", image: landingImage, description: "Blockchain verification for authentic artwork provenance" },
    { id: 2, title: "Digital Signatures", image: image2, description: "Cryptographically signed certificates of authenticity" },
    { id: 3, title: "Ownership Registry", image: image3, description: "Transparent record of artwork ownership and transfers" },
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

      {/* Featured Works Section */}
      <div className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Featured <span className={styles.highlightText}>Works</span></h2>
        <div className={styles.gallery}>
          {projects.map((project) => (
            <div 
              key={project.id}
              className={`${styles.galleryItem} ${activeProject === project.id ? styles.activeGalleryItem : ''}`}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className={styles.imageContainer}>
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  className={styles.galleryImage}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.verifiedBadge}>
                    <MdVerified style={{color: '#4cff4c', marginRight: '5px'}} />
                    Verified
                  </div>
                </div>
              </div>
              <div className={styles.galleryItemContent}>
                <h3 className={styles.galleryItemTitle}>{project.title}</h3>
                <p className={styles.galleryItemDesc}>{project.description}</p>
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
      
      <div id="moreContent">
        <MoreContent />
      </div>
    </div>
  );
};

export default Home;