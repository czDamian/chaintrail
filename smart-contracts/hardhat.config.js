require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts: "./src",
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: "your-snowtrace-api-key",
    },
  },
};

console.log("Private Key:", process.env.PRIVATE_KEY);
