import React from 'react';

const Header = () => {
  return (
    <>
      <header
        style={{
          fontFamily: 'Lora, sans-serif',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '10px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
        }}
      >
        {/* Logo */}
        <div>
          <img 
            src="/images/sample logo.png" 
            alt="Logo" 
            style={{ 
              maxHeight: '130px', 
              maxWidth: '150px', 
              objectFit: 'contain' 
            }} 
          />
        </div>
        
        {/* Navigation */}
        <nav>
          <ul
            style={{
              display: 'flex',
              listStyleType: 'none',
              margin: 0,
              padding: 0,
              gap: '20px',
            }}
          >
            <li><a href="/Manufacturer" style={navLinkStyle}>Home</a></li>
            <li><a href="/about" style={navLinkStyle}>About Us</a></li>
         
          </ul>
        </nav>
      </header>
      
      {/* Spacer to prevent content from being hidden behind header */}
      <div style={{ 
        height: '70px', // Matches the header height
        width: '100%' 
      }} />
    </>
  );
};

const navLinkStyle = {
  color: 'rgba(255,255,255,0.8)',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'color 0.3s ease',
  ':hover': {
    color: 'white'
  }
};

export default Header;