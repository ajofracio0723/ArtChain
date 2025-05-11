import React, { useState } from 'react';
import { X, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import styles from '../styles/ViewProducts.module.css';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Format owner address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Check if product has images
  const hasImages = product.images && product.images.length > 0;
  
  // Image navigation handlers
  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };
  
  // Render image or placeholder
  const renderImage = () => {
    if (hasImages) {
      return (
        <div className={styles.modalImageContainer}>
          <img 
            src={product.images[currentImageIndex].image} 
            alt={`${product.title} - ${currentImageIndex + 1}`}
            className={styles.modalImage}
          />
          
          {product.images.length > 1 && (
            <div className={styles.imageNavigation}>
              <button className={styles.imageNavButton} onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              <span className={styles.imageCounter}>
                {currentImageIndex + 1} / {product.images.length}
              </span>
              <button className={styles.imageNavButton} onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className={styles.productImagePlaceholder}>
          <Image size={48} />
          <div className={styles.placeholderText}>No image available</div>
        </div>
      );
    }
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
          {renderImage()}
          
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

export default ProductDetailsModal;