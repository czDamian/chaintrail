"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import nftContractABI from "../earn/abi.json";

export default function FetchUserNFTs() {
  const [userAddress, setUserAddress] = useState("");
  const [userNFTs, setUserNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
        // Get the userId from local storage
        const userId = localStorage.getItem("userId");

        // Fetch the wallet address of the user
        const response = await fetch(`/api/users?userId=${userId}`);
        const userData = await response.json();
        const walletAddress = userData.walletAddress;

        setUserAddress(walletAddress);

        // Use the CORE Testnet RPC provider
        const provider = new ethers.JsonRpcProvider(
          "https://rpc.test.btcs.network"
        );

        const contractAddress = "0x98e3f452b16e19b950e14faa59dc1a343b5d3ff8"; // Replace with the actual contract address
        const contract = new ethers.Contract(
          contractAddress,
          nftContractABI,
          provider
        );

        // Query the Transfer event to get all token IDs minted by this address
        const filter = contract.filters.Transfer(null, walletAddress); // Get all Transfer events to this address
        const events = await contract.queryFilter(filter);

        const uniqueTokenIds = new Set(
          events.map((event) => event.args.tokenId.toString())
        );
        const mintedNFTs = await Promise.all(
          Array.from(uniqueTokenIds).map(async (tokenId) => {
            const uri = await contract.tokenURI(tokenId);
            return { id: tokenId, uri };
          })
        );

        setUserNFTs(mintedNFTs);
      } catch (error) {
        console.error("Error fetching user NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNFTs();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {isLoading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">User Minted NFTs</h2>
          {userAddress && (
            <p className="mb-4">
              Wallet Address:{" "}
              {`${userAddress.substring(0, 6)}...${userAddress.substring(
                userAddress.length - 4
              )}`}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNFTs.length > 0 ? (
              userNFTs.map((nft, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 shadow-lg">
                  <p className="text-lg font-semibold mb-2">NFT ID: {nft.id}</p>
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
              <p className="text-center text-xl">No NFTs found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
