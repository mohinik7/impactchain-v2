require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Default to empty values if environment variables are not set
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const AMOY_RPC_URL = process.env.AMOY_RPC_URL || "https://polygon-amoy.infura.io/v3/your-project-id";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // Only include Amoy network if environment variables are properly set
    ...(process.env.PRIVATE_KEY && process.env.AMOY_RPC_URL
      ? {
          amoy: {
            url: AMOY_RPC_URL,
            accounts: [PRIVATE_KEY],
          },
        }
      : {}),
  },
};