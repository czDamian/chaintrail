"use client";
import { useState, useEffect } from "react";
import Web3 from "web3";
import nftContractABI from "./EduNft.json";
import { useAuth } from "@/app/AuthenticationProvider";

export default function FetchUserNFTs() {
  const [userAddress, setUserAddress] = useState("");
  const [userNFTs, setUserNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useAuth();

  const web3 = new Web3("https://open-campus-codex-sepolia.drpc.org");

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
    const userId = userInfo.userId;

        const response = await fetch(`/api/users?userId=${userId}`);
        const userData = await response.json();
        const walletAddress = userData.walletAddress;

        setUserAddress(walletAddress);

        const contractAddress = "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922";
        const contract = new web3.eth.Contract(nftContractABI, contractAddress);

        // Query the Transfer event to get all token IDs minted by this address
        const events = await contract.getPastEvents("Transfer", {
          filter: { to: walletAddress }, // Get all Transfer events to this address
          fromBlock: 0,
          toBlock: "latest",
        });

        const uniqueTokenIds = new Set(
          events.map((event) => event.returnValues.tokenId.toString())
        );

        const mintedNFTs = await Promise.all(
          Array.from(uniqueTokenIds).map(async (tokenId) => {
            const uri = await contract.methods.tokenURI(tokenId).call();
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
    <div className="p-6 text-white min-h-10 mb-20">
      {isLoading ? (
        <div className="text-center text-xl"></div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">My NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-content-center place-items-center">
            {userNFTs.length > 0 ? (
              userNFTs.map((nft, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-2 w-fit">
                  <div className="w-full h-48 max-w-48 rounded-lg overflow-hidden">
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
                You have not minted any NFT yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
