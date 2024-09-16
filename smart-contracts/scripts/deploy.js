//deploy script using hardhat 
//npx hardhat compile
//npx hardhat run scripts/deploy.js --network fuji
const hre = require("hardhat");

async function main() {
  const EDUNFT = await hre.ethers.deployContract("EDUNFT");

  await EDUNFT.waitForDeployment();
  console.log("EDUNFT deployed to:", EDUNFT.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
