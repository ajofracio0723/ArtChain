/**
 * Truffle configuration file for Sepolia testnet deployment
 */
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Retrieve environment variables
const MNEMONIC = process.env.MNEMONIC;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
      ),
      network_id: 11155111, // Sepolia's network id
      gas: 5500000,        // Gas limit used for deploys
      gasPrice: 460000000, // 0.46 Gwei, based on current market rates
      confirmations: 2,    // # of confirmations to wait between deployments
      timeoutBlocks: 200,  // # of blocks before a deployment times out
      skipDryRun: true     // Skip dry run before migrations
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19", // Fetch exact version from solc-bin
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};