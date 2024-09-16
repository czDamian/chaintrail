"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import nftContractABI from "./EduNft.json";
import Button from "../components/Reusable/Button";
import Loader from "../loader";
import { useAuth } from "@/app/AuthenticationProvider";
import { FaSpinner } from "react-icons/fa";

const NetworkInfo = ({ provider, onSwitchNetwork, currentChainId }) => {
  const [chainName, setChainName] = useState("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  useEffect(() => {
    const updateNetworkInfo = () => {
      if (currentChainId) {
        const name = getChainName(currentChainId);
        setChainName(name);
        setIsCorrectNetwork(name === "Avalanche Fuji Testnet");
      } else {
        setChainName("Unknown");
        setIsCorrectNetwork(false);
      }
    };

    updateNetworkInfo();
  }, [currentChainId]);

  const getChainName = (id) => {
    if (id.toString() === '43113' || id.toString() === '0xa869') {
      return "Avalanche Fuji Testnet";
    }
    return "Wrong Network";
  };

  return (
    <div className="mb-4 p-4 bg-gray-800 rounded-lg text-sm">
      <p>Current Network: {chainName}</p>
      <p>Chain ID: {currentChainId ? currentChainId.toString() : "Unknown"}</p>
      {!isCorrectNetwork && (
        <Button
          onClick={onSwitchNetwork}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-xs"
        >
          Switch to Avalanche Fuji Testnet
        </Button>
      )}
    </div>
  );
};

export default function FetchNFT() {
  const [contractAddress, setContractAddress] = useState("");
  const [contractName, setContractName] = useState("");
  const [contractSymbol, setContractSymbol] = useState("");
  const [allNFTs, setAllNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const [isMinting, setIsMinting] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const initEthers = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        try {
          const signer = await provider.getSigner();
          setSigner(signer);
          const network = await provider.getNetwork();
          setCurrentChainId(network.chainId);
        } catch (error) {
          console.error("Failed to get signer or network:", error);
        }

        // Listen for network changes
        window.ethereum.on("chainChanged", (chainId) => {
          setCurrentChainId(BigInt(chainId));
        });
      } else {
        const fallbackProvider = new ethers.WebSocketProvider("wss://avalanche-fuji-c-chain-rpc.publicnode.com");
        setProvider(fallbackProvider);
        const network = await fallbackProvider.getNetwork();
        setCurrentChainId(network.chainId);
      }
    };

    initEthers();

    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  // Function to calculate required points
  const calculateRequiredPoints = (index) => {
    const basePoints = 20000;
    return basePoints * (index + 1);
  };

  const getNextAvailableTokenId = async (contract) => {
    let tokenId = 0;
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

  const handleSwitchNetwork = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xa869' }], // Chain ID for Avalanche Fuji Testnet as a hex string
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xa869',
                chainName: 'Avalanche Fuji Testnet',
                nativeCurrency: {
                  name: 'Avalanche',
                  symbol: 'AVAX',
                  decimals: 18
                },
                rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://testnet.snowtrace.io/']
              }],
            });
          } catch (addError) {
            console.error("Failed to add network:", addError);
            setError("Failed to add Avalanche Fuji Testnet. Please add it manually.");
          }
        } else {
          console.error("Failed to switch network:", switchError);
          setError("Failed to switch network. Please try manually.");
        }
      }
    } else {
      setError("No Ethereum wallet detected. Please install MetaMask or use a compatible browser.");
    }
  };

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const contractAddress = "0xAedC12560864D6E0ba952977AD28556F848c9151";
        const contract = new ethers.Contract(contractAddress, nftContractABI, provider);

        // Check if the contract exists
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
          throw new Error("No contract found at the specified address");
        }

        // Fetch contract information
        try {
          const name = await contract.name();
          setContractName(name);
        } catch (nameError) {
          console.error("Error fetching contract name:", nameError);
          setContractName("Unknown");
        }

        try {
          const symbol = await contract.symbol();
          setContractSymbol(symbol);
        } catch (symbolError) {
          console.error("Error fetching contract symbol:", symbolError);
          setContractSymbol("Unknown");
        }

        setContractAddress(contractAddress);

        // Fetch total supply
        const totalSupply = await contract.totalSupply();

        // Fetch all NFTs
        const allNFTs = [];
        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
          try {
            const owner = await contract.ownerOf(tokenId);
            const uri = await contract.tokenURI(tokenId);
            allNFTs.push({ id: tokenId.toString(), owner, uri });
          } catch (nftError) {
            console.error(`Error fetching NFT ${tokenId}:`, nftError);
          }
        }

        setAllNFTs(allNFTs);

        // Fetch MAX_SUPPLY (if needed)
        try {
          const maxSupply = await contract.MAX_SUPPLY();
          console.log("Max Supply:", maxSupply.toString());
        } catch (maxSupplyError) {
          console.error("Error fetching MAX_SUPPLY:", maxSupplyError);
        }

      } catch (error) {
        console.error("Error fetching contract data:", error);
        setError(`Error fetching contract data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (provider) {
      fetchContractData();
    }
  }, [provider]);

  const handleMint = async (index) => {
    if (!signer) {
      setError("Wallet not connected. Please connect your wallet.");
      return;
    }

    setIsMinting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const contract = new ethers.Contract(contractAddress, nftContractABI, signer);
      const uri = allNFTs[index].uri; // Use the actual URI from the NFT data
      const tx = await contract.mint(await signer.getAddress(), uri);
      await tx.wait();

      console.log("Minting successful:", tx.hash);
      setSuccessMessage("NFT minted successfully!");
      
      // Set a timeout to refresh the page after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Minting error:", error);
      if (error.code === "ACTION_REJECTED" || (error.error && error.error.code === 4001)) {
        setError("Request cancelled");
      } else {
        setError("An error occurred while minting the NFT.");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const trimAddress = (address) =>
    `${address.substring(0, 7)}...${address.substring(address.length - 5)}`;

  return (
    <div className="p-6  text-white min-h-10">
      <NetworkInfo provider={provider} onSwitchNetwork={handleSwitchNetwork} currentChainId={currentChainId} />
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
          <h2 className="text-2xl font-bold mb-4">Available NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-content-center place-items-center">
            {allNFTs.length > 0 ? (
              allNFTs.map((nft, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 w-64 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-full h-64 rounded-lg overflow-hidden relative mb-3">
                    <img
                      alt={`NFT ${nft.id}`}
                      src={nft.uri}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs text-white">
                      #{nft.id}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">NFT Title</h3>
                    <span className="text-xs text-gray-400">ID: {nft.id}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-gray-300">
                      Min {calculateRequiredPoints(index).toLocaleString()}
                      <img
                        src="/coins.png"
                        alt="coins"
                        width={20}
                        height={20}
                        className="inline ml-1 align-text-bottom"
                      />
                    </span>
                    <span className="text-xs text-gray-400">Collection Name</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors duration-300"
                    onClick={() => handleMint(index)}
                    disabled={isMinting || calculateRequiredPoints(index) > userInfo.points}
                  >
                    {isMinting ? (
                      <div className="flex justify-center items-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Minting...
                      </div>
                    ) : (
                      "Mint NFT"
                    )}
                  </Button>
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
