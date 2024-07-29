async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);
  const IPFSHASH =
    "https://teal-deep-unicorn-287.mypinata.cloud/ipfs/Qme7zx73GwLbLij2qGZb975yNz1HFZ8bCb25qb6MC4hPK7";
  // Replace with the deployed contract address
  deployed_ca = "0x98e3f452b16e19b950e14faa59dc1a343b5d3ff8";
  const contractAddress = deployed_ca;
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(contractAddress);

  // Use the IPFS hash obtained from Pinata
  const ipfsHash = IPFSHASH;

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
