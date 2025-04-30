import React from 'react';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';

const ErrorModal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop" style={modalBackdropStyle} onClick={onClose}>
      <div className="modal-dialog" style={modalDialogStyle} onClick={e => e.stopPropagation()}>
        <div className="modal-content" style={modalContentStyle}>
          <div className="modal-icon" style={modalIconStyle}>
            <FaExclamationCircle size={36} />
          </div>
          <button 
            type="button" 
            className="close-button" 
            onClick={onClose} 
            style={closeButtonStyle}
          >
            <FaTimes />
          </button>
          <div className="modal-body" style={modalBodyStyle}>
            <h3 style={modalTitleStyle}>Error</h3>
            <p style={messageStyle}>{message}</p>
            <button 
              type="button" 
              onClick={onClose} 
              style={dismissButtonStyle}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lighter Styles
const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1050
};

const modalDialogStyle = {
  maxWidth: '400px',
  width: '90%',
  margin: '1.75rem auto'
};

const modalContentStyle = {
  position: 'relative',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  color: '#333',
  animation: 'modalFadeIn 0.3s ease-out'
};

const modalIconStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem 0 1rem 0',
  color: '#e74c3c'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'none',
  border: 'none',
  color: '#888',
  fontSize: '1.2rem',
  cursor: 'pointer',
  transition: 'color 0.2s',
  zIndex: 10,
  ':hover': {
    color: '#333'
  }
};

const modalBodyStyle = {
  padding: '0 2rem 2rem 2rem',
  textAlign: 'center'
};

const modalTitleStyle = {
  color: '#444',
  fontSize: '1.4rem',
  margin: '0 0 1rem 0',
  fontWeight: '600'
};

const messageStyle = {
  fontSize: '1rem',
  lineHeight: '1.5',
  marginBottom: '1.5rem',
  color: '#666'
};

const dismissButtonStyle = {
  padding: '0.7rem 2.3rem',
  fontSize: '0.95rem',
  fontWeight: '500',
  background: '#e74c3c',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: '0 3px 8px rgba(231, 76, 60, 0.3)',
  ':hover': {
    background: '#d44637',
    transform: 'translateY(-1px)',
    boxShadow: '0 5px 12px rgba(231, 76, 60, 0.4)'
  },
  ':active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 5px rgba(231, 76, 60, 0.4)'
  }
};

export default ErrorModal;