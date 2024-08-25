// Import necessary libraries
//then npx hardhat test

const { expect } = require("chai");

// Describe the test suite for the EDUNFT contract
describe("EDUNFT Contract", function () {
  let EDUNFT;
  let edunft;
  let owner;
  let addr1;
  let addr2;

  // Run before each test
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    EDUNFT = await ethers.getContractFactory("EDUNFT");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new instance of the contract before each test
    edunft = await EDUNFT.deploy();
    await edunft.deployed();
  });

  // Test case for the initial state
  it("Should have the correct name and symbol", async function () {
    expect(await edunft.name()).to.equal("EDUNFT");
    expect(await edunft.symbol()).to.equal("EDU");
  });

  // Test case for minting and total supply
  it("Should mint new tokens and update total supply", async function () {
    const tokenId = await edunft.mint(addr1.address, "http://token-uri.com/1");
    expect(await edunft.totalSupply()).to.equal(1);
    expect(await edunft.ownerOf(0)).to.equal(addr1.address);
    expect(await edunft.tokenURI(0)).to.equal("http://token-uri.com/1");
  });

  // Test case for querying balances
  it("Should update balances correctly", async function () {
    await edunft.mint(addr1.address, "http://token-uri.com/1");
    expect(await edunft.balanceOf(addr1.address)).to.equal(1);
  });

  // Test case for the max supply limit
  it("Should not mint more than the max supply", async function () {
    for (let i = 0; i < 1000; i++) {
      await edunft.mint(addr1.address, `http://token-uri.com/${i}`);
    }
    await expect(
      edunft.mint(addr1.address, "http://token-uri.com/1001")
    ).to.be.revertedWith("Max supply reached");
  });
});
