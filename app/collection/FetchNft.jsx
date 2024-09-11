"use client";
import { useState, useEffect } from "react";
import Web3 from "web3";
import nftContractABI from "./EduNft.json";
import Button from "../components/Reusable/Button";
import Loader from "../loader";
import { useAuth } from "@/app/AuthenticationProvider";
import { FaSpinner } from "react-icons/fa";

export default function FetchNFT() {
  const [contractAddress, setContractAddress] = useState("");
  const [contractName, setContractName] = useState("");
  const [contractSymbol, setContractSymbol] = useState("");
  const [allNFTs, setAllNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const [isMinting, setIsMinting] = useState(false);

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
    setIsMinting(true);
    const userId = userInfo.userId;
    if (!userId) {
      setError("User not logged in. Please log in first.");
      setIsMinting(false);
      return;
    }

    try {
      const response = await fetch(`/api/users?userId=${userId}`);
      const userData = await response.json();

      if (userData.points < requiredPoints) {
        setError(
          `Insufficient points. You need ${requiredPoints} points to mint this NFT.`
        );
        setIsMinting(false);
        return;
      }

      let web3Instance;
      let walletAddress;

      if (typeof window.ethereum !== "undefined") {
        // Use MetaMask or other injected Ethereum provider
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          web3Instance = new Web3(window.ethereum);

          // Check if the user is on the correct network
          const chainId = await web3Instance.eth.getChainId();
          console.log(chainId);
          if (!chainId.toString().startsWith('656476') && !chainId.toString().startsWith('0xa045c')) {
            throw new Error(
              "Please switch to the Open Edu Network to mint NFTs."
            );
          }
          const accounts = await web3Instance.eth.getAccounts();
          walletAddress = accounts[0];
        } catch (error) {
          throw new Error(`Error with Ethereum provider: ${error.message}`);
        }
      } else {
        // Use saved wallet
        if (!userData.walletAddress || !userData.privateKey) {
          throw new Error("Please connect your wallet first.");
        }

        walletAddress = userData.walletAddress;
        const privateKey = userData.privateKey;

        // Create a web3 instance with the private key and provider
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        web3Instance = web3;

        // Check if the user is on the correct network
        const chainId = await web3Instance.eth.getChainId();
        if (!chainId.toString().startsWith('656476') && !chainId.toString().startsWith('0xa045c')) {
          throw new Error(
            "Please switch to the Open Edu Network to mint NFTs."
          );
        }
      }

      const contract = new web3Instance.eth.Contract(
        nftContractABI,
        contractAddress
      );
      const nextTokenId = await getNextAvailableTokenId(contract);
      const newUri = `https://teal-deep-unicorn-287.mypinata.cloud/ipfs/${nextTokenId}`;

      // Check wallet balance
      const balance = await web3Instance.eth.getBalance(walletAddress);
      const gasEstimate = await contract.methods
        .mint(walletAddress, newUri)
        .estimateGas({ from: walletAddress });
      const gasPrice = await web3Instance.eth.getGasPrice();
      const estimatedTotalCost = gasEstimate * gasPrice;

      if (BigInt(balance) < BigInt(estimatedTotalCost)) {
        throw new Error(
          "Insufficient funds in your wallet to cover the transaction cost. Please add more funds and try again."
        );
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
      setError(
        error.message || "An error occurred while minting. Please try again."
      );
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="p-6  text-white min-h-10">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <h2 className="text-2xl font-bold mb-4">Available NFTs</h2>
          <p className="text-sm my-2">
            Below are available NFTs you can mint on EduChain after reaching a
            certain point threshold
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-content-center place-items-center">
            {allNFTs.length > 0 ? (
              allNFTs.map((nft, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-2 w-fit">
                  <div className="w-full h-48 max-w-48 rounded-lg overflow-hidden relative">
                    <img
                      alt={`NFT ${nft.id}`}
                      src={nft.uri}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      className="absolute bottom-1 right-1 bg-gold-500 text-black"
                      onClick={() => handleMint(calculateRequiredPoints(index))}
                      disabled={isMinting}>
                      {isMinting ? (
                        <div className="px-4 py-0.5">
                          <FaSpinner className="animate-spin" />
                        </div>
                      ) : (
                        "Mint"
                      )}
                    </Button>
                  </div>
                  <div className=" flex justify-between items-center my-2 text-sm">
                    <span>
                      Min {calculateRequiredPoints(index).toLocaleString()}
                      <img
                        src="/coins.png"
                        alt="coins"
                        width={24}
                        height={24}
                        className="inline ml-1 mr-4"
                      />
                    </span>
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
