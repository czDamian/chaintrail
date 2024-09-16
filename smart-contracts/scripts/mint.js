//mint nft using hardhat
//npx hardhat run scripts/mint.js --network fuji

const hre = require("hardhat");

async function main() {
  // Get the deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  // IPFS hashes
  const IPFSHASH2 =
    "https://teal-deep-unicorn-287.mypinata.cloud/ipfs/QmVN1gaD1NQ5RBaTnHyaF9r2fcz9ApVymY6u1XVAhVvd7H";
  const IPFSHASH3 =
    "https://teal-deep-unicorn-287.mypinata.cloud/ipfs/QmRc8kzxvk6DwKFMEWeaDmgFwjf9RNDWNzubPXXHnZsbYk";
  const IPFSHASH4 =
    "https://teal-deep-unicorn-287.mypinata.cloud/ipfs/QmUzdF5yyFjwj1eJzFv2fJfDaS7iTLNVHwqQ7CzJ7yhLHu";

  // Replace with the deployed contract address
  const contractAddress = "0xAedC12560864D6E0ba952977AD28556F848c9151";

  // Get the contract factory and attach it to the deployed contract
  const EduNFT = await hre.ethers.getContractFactory("EDUNFT");
  const eduNFT = EduNFT.attach(contractAddress);

  // Use the IPFS hash obtained from Pinata (change this if needed)
  const ipfsHash = IPFSHASH3;

  try {
    // Mint a new NFT
    const tx = await eduNFT.mint(deployer.address, ipfsHash);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("Minted NFT to:", deployer.address);
    console.log("Transaction hash:", tx.hash);
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// once its successful, you will get a message like this
// Using account: 0x367C4eF565EA335df0516d094661bE3C7a2A6423
// Minted NFT to: 0x367C4eF565EA335df0516d094661bE3C7a2A6423
// Transaction hash: 0x0d73703152c54bdfbf82e9df53f88cd0821d7dfa5bcb7e1d3b4093ed6303bd76