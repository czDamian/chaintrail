"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import nftContractABI from "../earn/abi.json";

export default function FetchNFT() {
  const [contractAddress, setContractAddress] = useState("");
  const [contractName, setContractName] = useState("");
  const [contractSymbol, setContractSymbol] = useState("");
  const [allNFTs, setAllNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
