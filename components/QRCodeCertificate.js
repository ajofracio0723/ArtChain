import React, { useEffect, useRef } from 'react';
import { FaDownload } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import QRCode from 'qrcode';
import styles from '../styles/AddProductForm.module.css';

const QRCodeCertificate = ({ qrCodeData, scanUrl }) => {
  const canvasRef = useRef(null);
  const [qrCodeUrl, setQRCodeUrl] = React.useState('');

  useEffect(() => {
    if (scanUrl && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, scanUrl, {
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

      QRCode.toDataURL(scanUrl, {
        errorCorrectionLevel: 'M',
        margin: 1,
        scale: 8
      }, (err, url) => {
        if (err) console.error(err);
        setQRCodeUrl(url);
      });
    }
  }, [scanUrl]);

  // Helper function to safely parse QR code data
  const safeParseQrData = () => {
    try {
      return qrCodeData ? JSON.parse(qrCodeData) : null;
    } catch (error) {
      console.error("Error parsing QR data:", error);
      return null;
    }
  };

  const qrDataObj = safeParseQrData();

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      const title = qrDataObj?.title || 'ArtCertificate';
      link.download = `${title}.png`;
      link.click();
    }
  };

  if (!qrDataObj) {
    return null;
  }

  return (
    <div className={styles.qrContainer}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Authentication Certificate</h2>
        
        <div className={styles.qrContentWrapper}>
          <div className={styles.qrCodeContainer}>
            <canvas ref={canvasRef} className={styles.qrCanvas}></canvas>
            <p className={styles.scanInstructions}>Scan with your phone camera</p>
          </div>
          
          <div className={styles.qrDetails}>
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>ID:</span>
              <span className={styles.qrValue}>{qrDataObj.productId}</span>
            </div>
            
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>Title:</span>
              <span className={styles.qrValue}>{qrDataObj.title}</span>
            </div>
            
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>Description:</span>
              <span className={styles.qrValue}>
                {qrDataObj.description.length > 30 
                  ? qrDataObj.description.substring(0, 30) + '...' 
                  : qrDataObj.description}
              </span>
            </div>
            
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>Artist:</span>
              <span className={styles.qrValue}>{qrDataObj.artist}</span>
            </div>
            
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>Size:</span>
              <span className={styles.qrValue}>{qrDataObj.size}</span>
            </div>
            
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>Medium:</span>
              <span className={styles.qrValue}>{qrDataObj.medium}</span>
            </div>
            
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>Year Created:</span>
              <span className={styles.qrValue}>{qrDataObj.yearCreated}</span>
            </div>
            
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>Registered:</span>
              <span className={styles.qrValue}>{qrDataObj.registeredDate}</span>
            </div>
            
            <div className={styles.qrInfoItem}>
              <span className={styles.qrLabel}>Transaction:</span>
              <span className={styles.qrValue}>
                {qrDataObj.transactionHash.substring(0, 10)}...
              </span>
            </div>
            
            {qrDataObj.imageId && (
              <div className={styles.qrInfoItem}>
                <span className={styles.qrLabel}>Image Stored:</span>
                <span className={styles.qrValue}>
                  <MdVerified className={styles.verifiedIconSmall} /> Yes
                </span>
              </div>
            )}
          </div>
        </div>
        
        <button 
          className={styles.secondaryButton} 
          onClick={downloadQRCode}
        >
          <FaDownload className={styles.buttonIcon} /> Download QR
        </button>
      </div>
    </div>
  );
};

export default QRCodeCertificate;