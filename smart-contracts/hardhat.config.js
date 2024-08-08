require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    coreTestnet: {
      url: "https://rpc.test.btcs.network",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1115,
    },
  },
};