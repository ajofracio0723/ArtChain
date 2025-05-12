import React from 'react';
import Image from 'next/image';
import blockchainImage from '../public/images/5.png';
import metaMaskImage from '../public/images/1.png';
import ethereumImage from '../public/images/6.png';
import styles from './../styles/Home.module.css'; // Import the CSS module

const MoreContent = () => {
  return (
    <div 
      id="moreContent" 
      className={styles.moreContentSection}
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      {/* Add a semi-transparent overlay to ensure content remains readable */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust opacity as needed
          zIndex: 1,
        }}
      />
      
      {/* Wrap all content in a container to position it above the overlay */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 className={styles.sectionTitle}>
          Understanding <span className={styles.highlightText}>Blockchain Technology</span>
        </h2>
        
        <div className={styles.featuresGrid}>
          {/* Blockchain Section */}
          <div className={`${styles.featureCard} ${styles.glassEffect}`}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>
                <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image src={blockchainImage} alt="Blockchain" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <h3 className={styles.featureTitle}>What is blockchain?</h3>
            <p className={styles.featureDescription}>
              Blockchain is a decentralized, distributed ledger technology that securely records transactions across multiple nodes. In Authentithief, blockchain serves as the foundation for creating a transparent and tamper-proof system for product identification and tracking.
            </p>
            <div className={styles.processSteps} style={{ marginTop: '2rem' }}>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Benefits of Authentithief</div>
                <ul className={styles.stepDescription} style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <li>Enhanced security and transparency in product identification</li>
                  <li>Real-time tracking of products through the supply chain</li>
                  <li>Decentralized and secure storage of product information</li>
                  <li>Automation of supply chain events through smart contracts</li>
                </ul>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Key Features</div>
                <ul className={styles.stepDescription} style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <li>User-friendly interface for all stakeholders</li>
                  <li>Blockchain-based authentication and authorization</li>
                  <li>Role-based access control</li>
                  <li>QR code scanner for easy product verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* MetaMask Section */}
          <div className={`${styles.featureCard} ${styles.glassEffect}`}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>
                <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image src={metaMaskImage} alt="MetaMask" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <h3 className={styles.featureTitle}>What is MetaMask?</h3>
            <p className={styles.featureDescription}>
              MetaMask is a cryptocurrency wallet and browser extension that allows users to interact with the Ethereum blockchain. It serves as a bridge between traditional browsers and the decentralized web, enabling users to securely manage their Ethereum-based assets and interact with decentralized applications (DApps).
            </p>
            <div className={styles.processSteps} style={{ marginTop: '2rem' }}>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Purpose of MetaMask</div>
                <p className={styles.stepDescription}>
                  MetaMask provides users with a convenient and secure way to store, send, and receive Ethereum and ERC-20 tokens. It also allows users to access decentralized finance (DeFi) applications, participate in token sales, and interact with smart contracts.
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>How to Use MetaMask</div>
                <ol className={styles.stepDescription} style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <li>Install the MetaMask browser extension</li>
                  <li>Follow the setup instructions</li>
                  <li>Fund your wallet by transferring Ethereum</li>
                  <li>Explore decentralized applications (DApps)</li>
                  <li>Approve transactions and interact with smart contracts</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Ethereum Section */}
          <div className={`${styles.featureCard} ${styles.glassEffect}`}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>
                <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image src={ethereumImage} alt="Ethereum" layout="fill" objectFit="cover" />
                </div>
              </div>
            </div>
            <h3 className={styles.featureTitle}>What is Ethereum?</h3>
            <p className={styles.featureDescription}>
              Ethereum is a decentralized platform that enables developers to build and deploy smart contracts and decentralized applications (DApps). It extends the blockchain's capabilities beyond just a cryptocurrency to include programmable code that runs on the Ethereum Virtual Machine (EVM).
            </p>
            <div className={styles.processSteps} style={{ marginTop: '2rem' }}>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Purpose of Ethereum</div>
                <p className={styles.stepDescription}>
                  Ethereum aims to create a more decentralized internet by allowing developers to create and execute smart contracts. These self-executing contracts with the terms of the agreement directly written into code can automate complex transactions and processes, reducing the need for intermediaries.
                </p>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepTitle}>Key Features of Ethereum</div>
                <ul className={styles.stepDescription} style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                  <li>Smart Contracts: Self-executing contracts that automate transactions</li>
                  <li>Decentralized Applications (DApps): Applications that run on a decentralized network</li>
                  <li>Ethereum Virtual Machine (EVM): A runtime environment for smart contracts</li>
                  <li>Ether (ETH): The native cryptocurrency used to pay for transactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <h2 className={styles.sectionTitle} style={{ marginTop: '6rem' }}>
          How It <span className={styles.highlightText}>Works</span>
        </h2>
        
        <div className={styles.processSteps}>
          <div className={`${styles.processStep} ${styles.glassEffect}`}>
            <div className={styles.stepNumber}>1</div>
            <h4 className={styles.stepTitle}>Connect Your Wallet</h4>
            <p className={styles.stepDescription}>Connect your MetaMask wallet to our platform to securely verify your identity and enable transactions.</p>
          </div>
          
          <div className={`${styles.processStep} ${styles.glassEffect}`}>
            <div className={styles.stepNumber}>2</div>
            <h4 className={styles.stepTitle}>Register Product</h4>
            <p className={styles.stepDescription}>Register your product by providing details and creating a unique digital identity on the blockchain.</p>
          </div>
          
          <div className={`${styles.processStep} ${styles.glassEffect}`}>
            <div className={styles.stepNumber}>3</div>
            <h4 className={styles.stepTitle}>Verify Authenticity</h4>
            <p className={styles.stepDescription}>Use our QR code scanner to verify the authenticity of products and track their journey through the supply chain.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreContent;