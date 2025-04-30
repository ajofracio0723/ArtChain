import React from 'react';
import Header from '../components/Header';
import { FaEthereum, FaShieldAlt, FaQrcode, FaPaintBrush, FaUserCheck } from 'react-icons/fa';
import styles from '../styles/AboutUs.module.css';

const AboutUs = () => {
  const handleExploreGalleryClick = () => {
    const moreContentSection = document.getElementById('moreContent');
    moreContentSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.heroSection}>
        <h1 className={styles.mainTitle}>
          About <span className={styles.titleHighlight}>Art</span>Chain
        </h1>
        <p className={styles.subtitle}>Revolutionizing Art Authentication Through Blockchain Technology</p>
      </div>
      
      <div className={styles.contentSection}>
        <div className={styles.missionSection}>
          <h2 className={styles.sectionTitle}>Our <span className={styles.highlightText}>Mission</span></h2>
          <div className={styles.divider}></div>
          <p className={styles.paragraph}>
            At ArtChain, we're transforming the art world by bringing together fine art appreciation with cutting-edge 
            blockchain technology. We're addressing one of the art market's most persistent challenges: verifying the 
            authenticity and provenance of valuable artwork. Our platform creates an immutable record of artwork history,
            ownership, and authentication that builds trust between artists, collectors, and institutions.
          </p>
        </div>
        
        <div className={styles.twoColumnSection}>
          <div className={styles.column}>
            <div className={styles.iconContainer}>
              <FaShieldAlt className={styles.icon} />
            </div>
            <h3 className={styles.featureTitle}>Provenance Guaranteed</h3>
            <p className={styles.featureText}>
              Every artwork registered with ArtChain receives a unique blockchain-verified QR code that proves its authenticity. 
              Our system creates an unalterable record of ownership history, making forgery virtually impossible.
            </p>
          </div>
          
          <div className={styles.column}>
            <div className={styles.iconContainer}>
              <FaPaintBrush className={styles.icon} />
            </div>
            <h3 className={styles.featureTitle}>Artist Protection</h3>
            <p className={styles.featureText}>
              We empower artists by giving them control over the verification of their work. Our platform allows creators to 
              maintain the integrity of their portfolio while ensuring collectors receive authentic pieces.
            </p>
          </div>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How Our <span className={styles.highlightText}>Technology</span> Works</h2>
          <div className={styles.divider}></div>
          
          <div className={styles.techStepsSection}>
            <div className={styles.techStep}>
              <div className={styles.stepNumber}>1</div>
              <h4 className={styles.stepTitle}>Artwork Registration</h4>
              <p className={styles.stepText}>
                Each artwork is registered on the Ethereum blockchain with unique attributes, provenance data, and creator information.
              </p>
            </div>
            
            <div className={styles.techStep}>
              <div className={styles.stepNumber}>2</div>
              <h4 className={styles.stepTitle}>Authentication Certificate</h4>
              <p className={styles.stepText}>
                A unique QR code certificate is generated containing immutable blockchain transaction details linked to the specific artwork.
              </p>
            </div>
            
            <div className={styles.techStep}>
              <div className={styles.stepNumber}>3</div>
              <h4 className={styles.stepTitle}>Verification Process</h4>
              <p className={styles.stepText}>
                Collectors scan the QR code to instantly verify authenticity, creation date, ownership history, and artist information.
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.storySection}>
          <h2 className={styles.sectionTitle}>Our <span className={styles.highlightText}>Story</span></h2>
          <div className={styles.divider}></div>
          <p className={styles.paragraph}>
            ArtChain began with a passion for authentic art and a vision to protect artists and collectors from the growing problems of forgery and misattribution.
            As the digital age transformed how we buy, sell, and appreciate art, we saw an opportunity to apply blockchain technology to solve these critical issues.
          </p>
          <p className={styles.paragraph}>
            Founded by a collective of artists, technologists, and art historians, ArtChain bridges the gap between centuries-old art traditions and cutting-edge
            distributed ledger technology. We believe art authentication should be transparent, verifiable, and accessible to all participants in the art ecosystem.
          </p>
          <p className={styles.paragraph}>
            Our platform represents the convergence of artistic expression and technological innovation – creating a new standard for trust in the art market
            while preserving the integrity of creative works for future generations.
          </p>
        </div>
        
        <div className={styles.twoColumnSection}>
          <div className={styles.column}>
            <div className={styles.iconContainer}>
              <FaUserCheck className={styles.icon} />
            </div>
            <h3 className={styles.featureTitle}>Collector Confidence</h3>
            <p className={styles.featureText}>
              Our blockchain verification system gives collectors unparalleled confidence in their acquisitions by providing
              an immutable record of authentication directly from the artist or estate.
            </p>
          </div>
          
          <div className={styles.column}>
            <div className={styles.iconContainer}>
              <FaQrcode className={styles.icon} />
            </div>
            <h3 className={styles.featureTitle}>Seamless Verification</h3>
            <p className={styles.featureText}>
              No technical expertise required. Simply scan the artwork's QR code with your smartphone to instantly verify its
              authenticity through our elegant and intuitive interface.
            </p>
          </div>
        </div>

        <div className={styles.innovationSection}>
          <h2 className={styles.sectionTitle}>The <span className={styles.highlightText}>Future</span> of Art Authentication</h2>
          <div className={styles.divider}></div>
          <p className={styles.paragraph}>
            ArtChain represents a revolutionary approach to art authentication and provenance. Our technology provides a robust
            solution to longstanding challenges in the art world while creating new opportunities for artists and collectors alike.
          </p>
          <div className={styles.timelineContainer}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineHeading}>Artist Onboarding</h4>
                <p className={styles.timelineText}>Artists register their works directly on our platform, establishing verifiable authenticity from creation</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineHeading}>Smart Contract Certification</h4>
                <p className={styles.timelineText}>Each artwork receives a unique digital certificate through Ethereum smart contracts</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineHeading}>Ownership Transfer</h4>
                <p className={styles.timelineText}>Transparent and secure transfer of ownership recorded permanently on the blockchain</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineHeading}>Legacy Preservation</h4>
                <p className={styles.timelineText}>Artwork provenance and history permanently preserved for future generations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Experience the ArtChain Difference</h2>
        <p className={styles.ctaText}>
          Join us at the intersection of art and technology, where blockchain brings a new level of trust to the world of fine art.
        </p>
        <button 
          onClick={handleExploreGalleryClick} 
          className={styles.ctaButton}
          id="moreContent"
        >
          <span>Explore Gallery</span>
          <div className={styles.buttonGlow}></div>
        </button>
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

export default AboutUs;