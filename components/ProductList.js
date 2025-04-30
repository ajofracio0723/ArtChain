import React, { useState, useMemo } from 'react';
import { FaCheck, FaDownload, FaTag } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';

const ProductList = ({ products, registrationFee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'date') {
        return new Date(b.registeredDateTime) - new Date(a.registeredDateTime);
      }
      return 0;
    });
  }, [products, searchTerm, sortOption]);

  const downloadQRCode = (index, product) => {
    const canvas = document.getElementById(`qr-code-${index}`);
    const pngUrl = canvas.toDataURL('image/png', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${product.name || 'product'}-qrcode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Format date for QR code in the same format as AddProductForm
  const formatDateTimeForQR = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return "Invalid Date";
      
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      
      let hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <div className="container" style={containerStyle}>
      <div className="mb-4">
        <h2 className="text-white mb-4" style={headingStyle}>Added Products</h2>
        <div className="text-center text-white mb-3" style={registrationFeeStyle}>
          Registration Fee: {registrationFee} Wei
        </div>
        <div className="search-sort-container" style={searchSortContainerStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="search" style={labelStyle}>Search:</label>
            <input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="sort" style={labelStyle}>Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={dropdownStyle}
            >
              <option value="">Select</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
              <option value="date">Date (Newest First)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-white" style={emptyStateStyle}>
          No products match your search.
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product, index) => {
            // Generate QR code data in the same format as AddProductForm
            const qrCodeData = JSON.stringify({
              name: product.name,
              registeredDate: formatDateTimeForQR(product.registeredDateTime),
              expirationDate: product.expirationTimestamp ? 
                formatDateTimeForQR(new Date(Number(product.expirationTimestamp) * 1000)) : 
                "No expiration",
              expirationTimestamp: product.expirationTimestamp ? Number(product.expirationTimestamp) : 0,
              contractAddress: product.owner || "",
              transactionHash: ""  // This isn't available in the product data
            });
            
            return (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <div className="card" style={cardStyle}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0" style={cardTitleStyle}>
                        {product.name}
                      </h5>
                      <span className="badge bg-success" style={badgeStyle}>
                        <FaCheck style={{ marginRight: '4px' }} /> Authentic
                      </span>
                    </div>

                    <div style={cardContentStyle}>
                      <p><strong>Registered:</strong> {formatDate(product.registeredDateTime)}</p>
                      <p><FaTag style={{ marginRight: '5px' }} /><strong>Owner:</strong> {product.owner && 
                        `${product.owner.substring(0, 6)}...${product.owner.substring(product.owner.length - 4)}`}</p>
                    </div>

                    {/* QR Code */}
                    <div className="text-center mt-3">
                      <QRCodeCanvas
                        id={`qr-code-${index}`}
                        value={qrCodeData}
                        size={300}
                        level="M"
                        includeMargin={true}
                      />
                    </div>

                    {/* Download Button */}
                    <div className="text-center mt-2">
                      <button 
                        onClick={() => downloadQRCode(index, product)}
                        style={downloadButtonStyle}
                      >
                        <FaDownload style={{ marginRight: '5px' }} /> Download QR Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const downloadButtonStyle = {
  backgroundColor: '#8A2BE2',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  fontSize: '1rem',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  marginTop: '10px',
};

const containerStyle = {
  padding: '2rem',
};

const headingStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  textShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
};

const registrationFeeStyle = {
  fontSize: '1rem',
  marginBottom: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  padding: '10px',
  borderRadius: '5px',
  display: 'inline-block',
};

const searchSortContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '600px',
  margin: '0 auto 2rem',
};

const inputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const labelStyle = {
  color: '#fff',
  fontSize: '0.9rem',
  fontWeight: 'bold',
};

const searchInputStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(138, 43, 226, 0.5)',
  color: '#fff',
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '5px',
  width: '320px',
};

const dropdownStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(138, 43, 226, 0.5)',
  color: '#fff',
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '5px',
  width: '150px',
  cursor: 'pointer',
  outline: 'none',
};

const cardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '15px',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  color: '#fff',
  height: '100%',
};

const cardTitleStyle = {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1.25rem',
  textShadow: '0 0 5px rgba(138, 43, 226, 0.3)',
};

const cardContentStyle = {
  color: 'rgba(255, 255, 255, 0.8)',
};

const badgeStyle = {
  padding: '0.5rem 0.75rem',
  borderRadius: '20px',
  fontWeight: 'normal',
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.9rem',
};

const emptyStateStyle = {
  padding: '3rem',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '15px',
  fontSize: '1.2rem',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
};

export default ProductList;