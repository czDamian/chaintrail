async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const IPFSHASH2 =
    "https://teal-deep-unicorn-287.mypinata.cloud/ipfs/QmVN1gaD1NQ5RBaTnHyaF9r2fcz9ApVymY6u1XVAhVvd7H";
  const IPFSHASH3 =
    "https://teal-deep-unicorn-287.mypinata.cloud/ipfs/QmRc8kzxvk6DwKFMEWeaDmgFwjf9RNDWNzubPXXHnZsbYk";
  const IPFSHASH4 =
    "https://teal-deep-unicorn-287.mypinata.cloud/ipfs/QmUzdF5yyFjwj1eJzFv2fJfDaS7iTLNVHwqQ7CzJ7yhLHu";

  // Replace with the deployed contract address
  deployed_ca = "0x98e3f452b16e19b950e14faa59dc1a343b5d3ff8";
  const contractAddress = deployed_ca;
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(contractAddress);

  // Use the IPFS hash obtained from Pinata
  const ipfsHash = IPFSHASH4;

  // Mint a new NFT
  const tx = await simpleNFT.mint(deployer.address, ipfsHash);
  await tx.wait();

  console.log("Minted NFT to:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
