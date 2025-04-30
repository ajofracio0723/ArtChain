import React, { useState } from 'react';
import { FaBitcoin, FaEthereum, FaCubes } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const SignUpForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    if (username && password && email && confirmPassword && password === confirmPassword) {
      setIsLoading(true); // Start loading animation
      setTimeout(() => {
        alert('Sign-up successful! Redirecting to login page...');
        router.push('/LoginForm'); // Redirect to login page after successful sign-up
      }, 2000);
    } else {
      alert('Please fill in all fields and make sure passwords match.');
    }
  };

  const checkFormFilled = () => {
    if (username && password && confirmPassword && email) {
      setIsFormFilled(true);
    } else {
      setIsFormFilled(false);
    }
  };

  return (
    <div style={loginContainerStyle}>
      <div style={loginFormStyle}>
        <div style={iconContainerStyle}>
          <FaBitcoin style={iconStyle} />
          <FaEthereum style={iconStyle} />
          <FaCubes style={iconStyle} />
        </div>
        <h2 style={titleStyle}>Sign Up for Authentithief</h2>
        <p style={subtitleStyle}>Create a new account</p>
        <input
          type="text"
          placeholder="Enter your username"
          style={inputStyle}
          value={username}
          onChange={(e) => { setUsername(e.target.value); checkFormFilled(); }}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          style={inputStyle}
          value={email}
          onChange={(e) => { setEmail(e.target.value); checkFormFilled(); }}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          style={inputStyle}
          value={password}
          onChange={(e) => { setPassword(e.target.value); checkFormFilled(); }}
          required
        />
        <input
          type="password"
          placeholder="Confirm your password"
          style={inputStyle}
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); checkFormFilled(); }}
          required
        />
        <button onClick={handleSignUp} style={{ ...buttonStyle, ...(isFormFilled ? {} : { opacity: 0.5, pointerEvents: 'none' }) }}>
          {isLoading ? (
            <RingLoader color={'#fff'} loading={true} css={override} size={32} />
          ) : (
            <span>Sign Up</span>
          )}
        </button>
        <p style={descriptionStyle}>
          Join us and secure your products with Authentithief.
        </p>
      </div>
    </div>
  );
};

// Styles
const loginContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'radial-gradient(circle, #1a0938, #000000)',
  color: '#fff',
};

const loginFormStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '3rem',
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const iconContainerStyle = {
  marginBottom: '1rem',
};

const iconStyle = {
  fontSize: '2rem',
  marginRight: '0.5rem',
};

const titleStyle = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
};

const subtitleStyle = {
  fontSize: '1.5rem',
  marginBottom: '2rem',
  textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
};

const inputStyle = {
  padding: '0.8rem',
  fontSize: '1rem',
  marginBottom: '1rem',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  width: '100%',
};

const buttonStyle = {
  padding: '0.8rem 2.5rem',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  backgroundImage: 'linear-gradient(to right, #8e2de2, #4a00e0)',
  color: '#fff',
  border: '2px solid #6f42c1',
  borderRadius: '50px',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'background-color 0.3s ease',
  boxShadow: '0 0 10px rgba(116, 79, 160, 0.5)',
};

const descriptionStyle = {
  fontSize: '1.2rem',
  textAlign: 'center',
  marginTop: '1rem',
  textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
};

export default SignUpForm;
