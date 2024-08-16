"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import nftContractABI from "./abi.json";
import Button from "../components/Reusable/Button";

export default function FetchNFT() {
  const [contractAddress, setContractAddress] = useState("");
  const [contractName, setContractName] = useState("");
  const [contractSymbol, setContractSymbol] = useState("");
  const [allNFTs, setAllNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to calculate required points
  const calculateRequiredPoints = (index) => {
    const basePoints = 20000;
    return basePoints * (index + 1);
  };

  const getNextAvailableTokenId = async (contract) => {
    let tokenId = 3; // Start from 3 since you're hiding the first 3 NFTs
    while (true) {
      try {
        await contract.tokenURI(tokenId);
        tokenId++;
      } catch (error) {
        // If this throws an error, it means the token doesn't exist
        return tokenId;
      }
    }
  };

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(
          "https://rpc.test.btcs.network"
        );

        const contractAddress = "0x98e3f452b16e19b950e14faa59dc1a343b5d3ff8";
        const contract = new ethers.Contract(
          contractAddress,
          nftContractABI,
          provider
        );
        // Fetch contract information
        const name = await contract.name();
        const symbol = await contract.symbol();

        // Query the Transfer event to get all token IDs
        const filter = contract.filters.Transfer(null, null);
        const events = await contract.queryFilter(filter);

        const uniqueTokenIds = new Set(
          events.map((event) => event.args.tokenId.toString())
        );

        // Fetch all NFTs on CORE
        const allNFTs = await Promise.all(
          Array.from(uniqueTokenIds).map(async (tokenId) => {
            const owner = await contract.ownerOf(tokenId);
            const uri = await contract.tokenURI(tokenId);
            return { id: tokenId, owner, uri };
          })
        );

        // Hide the first 3 NFTS
        const displayedNFTs = allNFTs.slice(3);

        setContractAddress(contractAddress);
        setContractName(name);
        setContractSymbol(symbol);
        setAllNFTs(displayedNFTs);
      } catch (error) {
        console.error("Error fetching contract data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractData();
  }, []);

  // Function to trim addresses
  const trimAddress = (address) =>
    `${address.substring(0, 7)}...${address.substring(address.length - 5)}`;

  const handleMint = async (requiredPoints) => {
    setError(null);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in. Please log in first.");
      return;
    }

    try {
      // Fetch user data
      const response = await fetch(`/api/users?userId=${userId}`);
      const userData = await response.json();

      if (!userData.walletAddress || !userData.privateKey) {
        setError("Please connect your wallet first.");
        return;
      }

      if (userData.points < requiredPoints) {
        setError(
          `Insufficient points. You need ${requiredPoints} points to mint this NFT.`
        );
        return;
      }

      const provider = new ethers.JsonRpcProvider(
        "https://rpc.test.btcs.network"
      );
      const wallet = new ethers.Wallet(userData.privateKey, provider);
      const contract = new ethers.Contract(
        contractAddress,
        nftContractABI,
        wallet
      );

      // Get the next available token ID
      const nextTokenId = await getNextAvailableTokenId(contract);

      // Generate a new URI for the token
      const newUri = `https://teal-deep-unicorn-287.mypinata.cloud/ipfs/${nextTokenId}`;

      // Check wallet balance
      const balance = await provider.getBalance(userData.walletAddress);
      const estimatedGasCost = BigInt(
        await contract.mint.estimateGas(userData.walletAddress, newUri)
      );
      const feeData = await provider.getFeeData();
      const gasPrice = BigInt(feeData.gasPrice);
      const estimatedTotalCost = estimatedGasCost * gasPrice;

      if (balance < estimatedTotalCost) {
        setError(
          "Insufficient funds in your wallet to cover the transaction cost. Please add more funds and try again."
        );
        return;
      }

      // Call the mint function with the new token ID
      const tx = await contract.mint(userData.walletAddress, newUri);
      await tx.wait();

      console.log("Minting successful. Transaction hash:", tx.hash);

      // Refresh the page after successful minting
      window.location.reload();
    } catch (error) {
      console.error("Minting error:", error);
      setError("An error occurred while minting. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {isLoading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            NFT Information (CORE Testnet)
          </h2>
          <p>Only NFTs minted on CORE testnet will be displayed here</p>
          <p className="mb-2">
            Contract Address: {trimAddress(contractAddress)}
          </p>
          <p className="mb-2">Contract Name: {contractName}</p>
          <p className="mb-4">Contract Symbol: {contractSymbol}</p>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <h2 className="text-2xl font-bold mb-4">Available NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNFTs.length > 0 ? (
              allNFTs.map((nft, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 shadow-lg">
                  <p className="text-lg font-semibold mb-2">ID: {nft.id}</p>
                  <p className="mb-4">Owner: {trimAddress(nft.owner)}</p>
                  <div className="w-full h-48 bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      alt={`NFT ${nft.id}`}
                      src={nft.uri}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-center my-2">
                    <span>
                      Min {calculateRequiredPoints(index).toLocaleString()}
                      points
                    </span>
                    <Button
                      className="bg-gold-500 text-black"
                      onClick={() =>
                        handleMint(calculateRequiredPoints(index))
                      }>
                      Mint
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xl">
                No NFTs found for this contract on CORE testnet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
