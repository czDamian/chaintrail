"use client";
import { useState, useEffect } from "react";
import Web3 from "web3";
import nftContractABI from "./EduNft.json";
import Button from "../components/Reusable/Button";

export default function FetchNFT() {
  const [contractAddress, setContractAddress] = useState("");
  const [contractName, setContractName] = useState("");
  const [contractSymbol, setContractSymbol] = useState("");
  const [allNFTs, setAllNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Web3 provider for Edu Chain
  const web3 = new Web3("https://open-campus-codex-sepolia.drpc.org");

  // Function to calculate required points
  const calculateRequiredPoints = (index) => {
    const basePoints = 20000;
    return basePoints * (index + 1);
  };

  const getNextAvailableTokenId = async (contract) => {
    let tokenId = 0;
    while (true) {
      try {
        await contract.methods.tokenURI(tokenId).call();
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
        const contractAddress = "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922";
        const contract = new web3.eth.Contract(nftContractABI, contractAddress);

        // Fetch contract information
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        setContractAddress(contractAddress);
        setContractName(name);
        setContractSymbol(symbol);

        // Query the Transfer event to get all token IDs
        const events = await contract.getPastEvents("Transfer", {
          fromBlock: 0,
          toBlock: "latest",
        });

        const uniqueTokenIds = new Set(
          events.map((event) => event.returnValues.tokenId.toString())
        );

        // Fetch all NFTs on Edu Chain
        const allNFTs = await Promise.all(
          Array.from(uniqueTokenIds).map(async (tokenId) => {
            const owner = await contract.methods.ownerOf(tokenId).call();
            const uri = await contract.methods.tokenURI(tokenId).call();
            return { id: tokenId, owner, uri };
          })
        );

        setAllNFTs(allNFTs);
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setError("Error fetching contract data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractData();
  }, []);

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

      const walletAddress = userData.walletAddress;
      const privateKey = userData.privateKey;

      // Create a web3 instance with the private key and provider
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      web3.eth.accounts.wallet.add(account);

      const contract = new web3.eth.Contract(nftContractABI, contractAddress);

      // Get the next available token ID
      const nextTokenId = await getNextAvailableTokenId(contract);

      // Generate a new URI for the token
      const newUri = `https://teal-deep-unicorn-287.mypinata.cloud/ipfs/${nextTokenId}`;

      // Check wallet balance
      const balance = await web3.eth.getBalance(walletAddress);
      const gasEstimate = await contract.methods
        .mint(walletAddress, newUri)
        .estimateGas({ from: walletAddress });
      const gasPrice = await web3.eth.getGasPrice();
      const estimatedTotalCost = gasEstimate * gasPrice;

      if (BigInt(balance) < BigInt(estimatedTotalCost)) {
        setError(
          "Insufficient funds in your wallet to cover the transaction cost. Please add more funds and try again."
        );
        return;
      }

      // Call the mint function with the new token ID
      const tx = await contract.methods
        .mint(walletAddress, newUri)
        .send({ from: walletAddress });
      console.log("Minting successful. Transaction hash:", tx.transactionHash);

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
            NFT Information (Edu Chain)
          </h2>
          <p className="mb-2 text-gray-300 text-sm">
            Contract Address: {trimAddress(contractAddress)}
          </p>
          <p className="mb-2 text-gray-300 text-sm">
            Contract Name: {contractName}
          </p>
          <p className="mb-4 text-gray-300 text-sm">
            Contract Symbol: {contractSymbol}
          </p>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <h2 className="text-2xl font-bold mb-4">Available NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNFTs.length > 0 ? (
              allNFTs.map((nft, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="w-full h-48 bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      alt={`NFT ${nft.id}`}
                      src={nft.uri}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-center my-2">
                    <span>
                      Min {calculateRequiredPoints(index).toLocaleString()}{" "}
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
              <p className="text-center text-xl">No NFTs yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
