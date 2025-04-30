import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { FaBitcoin, FaEthereum, FaCube, FaCamera } from 'react-icons/fa';
import jsQR from 'jsqr';
import { Alert } from 'react-bootstrap';
import { RingLoader } from 'react-spinners'; // Import RingLoader

const QRScanner = () => {
  const router = useRouter();
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false); // New state to handle loading
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const successSoundRef = useRef(null);
  const isProcessingRef = useRef(false);

  const processQRCode = useCallback(() => {
    const video = videoRef.current;
    if (!video || isProcessingRef.current) return;

    setLoading(true); // Show loading animation
    isProcessingRef.current = true;

    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        try {
          const productDetails = JSON.parse(code.data);

          if (!productDetails.uniqueIdentifier || !productDetails.name || !productDetails.brand) {
            throw new Error('Invalid QR code data');
          }

          const isScannedBefore = localStorage.getItem(`scanned_${productDetails.uniqueIdentifier}`);

          if (isScannedBefore) {
            productDetails.isReAuthenticated = true;
          } else {
            productDetails.isReAuthenticated = false;
            localStorage.setItem(`scanned_${productDetails.uniqueIdentifier}`, true);
          }

          successSoundRef.current.play();
          setScanSuccess(true);
          setTimeout(() => {
            router.push(`/product-status?name=${productDetails.name}&brand=${productDetails.brand}&uniqueIdentifier=${productDetails.uniqueIdentifier}&registeredDateTime=${productDetails.registeredDateTime}&isReAuthenticated=${productDetails.isReAuthenticated}`);
          }, 1000);
        } catch (err) {
          console.error('Invalid QR code:', err);
          router.push('/product-status?invalid=true');
        }
      }

      setLoading(false); // Hide loading animation after processing
      isProcessingRef.current = false;
    }, 500);
  }, [router]);

  const handleFileInputChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const canvasContext = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          canvasContext.drawImage(img, 0, 0, img.width, img.height);

          const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            try {
              const productDetails = JSON.parse(code.data);

              if (!productDetails.uniqueIdentifier || !productDetails.name || !productDetails.brand) {
                throw new Error('Invalid QR code data');
              }

              const isScannedBefore = localStorage.getItem(`scanned_${productDetails.uniqueIdentifier}`);

              if (isScannedBefore) {
                productDetails.isReAuthenticated = true;
              } else {
                productDetails.isReAuthenticated = false;
                localStorage.setItem(`scanned_${productDetails.uniqueIdentifier}`, true);
              }

              successSoundRef.current.play();
              setScanSuccess(true);
              setTimeout(() => {
                router.push(`/product-status?name=${productDetails.name}&brand=${productDetails.brand}&uniqueIdentifier=${productDetails.uniqueIdentifier}&registeredDateTime=${productDetails.registeredDateTime}&isReAuthenticated=${productDetails.isReAuthenticated}`);
              }, 1000);
            } catch (err) {
              console.error('Invalid QR code from uploaded image:', err);
              router.push('/product-status?invalid=true');
            }
          } else {
            console.error('No QR code detected in uploaded image.');
            router.push('/product-status?invalid=true');
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);

      e.target.value = null;
    },
    [router]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
          video.play();
          setInterval(() => {
            processQRCode();
          }, 500); // Process frames every 500ms
        });
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startVideoStream();

    return () => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [processQRCode]);

  return (
    <div className="container-fluid" style={{ ...containerStyle, paddingTop: '50px' }}>
      <Header />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={cardStyle}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-4">
                <FaBitcoin style={cryptoIconStyle} />
                <FaEthereum style={cryptoIconStyle} />
                <FaCube style={cryptoIconStyle} />
              </div>
              <h2 className="text-center mb-4" style={authentithiefTitleStyle}>AUTHENTITHIEF</h2>
              <h1 className="text-center mb-4" style={titleStyle}>
                <FaCamera style={{ marginRight: '0.5rem' }} />
                QR Code Scanner
              </h1>
              <div className="scanner-container" style={scannerContainerStyle}>
                <video ref={videoRef} style={videoStyle} />
                {loading && (
                  <div style={loadingOverlayStyle}>
                    <RingLoader color="#fff" loading={loading} size={100} />
                  </div>
                )}
                {showSuccessAlert && (
                  <Alert
                    variant="success"
                    onClose={() => setShowSuccessAlert(false)}
                    dismissible
                    className="small-alert"
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      minWidth: '200px',
                    }}
                  >
                    Product is authentic
                  </Alert>
                )}
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => fileInputRef.current.click()}
              >
                Upload QR Code Image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <audio ref={successSoundRef} src="/1.mp3" />
    </div>
  );
};

const loadingOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '10px',
};

const containerStyle = {
  background: 'radial-gradient(circle, #330066, #000000)',
  minHeight: '100vh',
  color: '#fff',
};

const cardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '3rem',
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
};

const authentithiefTitleStyle = {
  fontSize: '3.5rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
  textAlign: 'center',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  color: '#f0f0f0',
};

const titleStyle = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
  textAlign: 'center',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  color: '#f0f0f0',
};

const scannerContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
};

const videoStyle = {
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '10px',
};

const cryptoIconStyle = {
  fontSize: '3rem',
  marginRight: '0.5rem',
  color: '#fff',
};

export default QRScanner;
