"use client";
// import { useEffect, useState, useCallback } from "react";
// import { ethers } from "ethers";
// import Button from "../components/Reusable/Button";
// import { CgClose } from "react-icons/cg";
// import { IoCopy } from "react-icons/io5";

// const ErrorMessage = ({ message, onClose }) => (
//   <div className="fixed mx-4 rounded text-xs top-16 left-0 right-0 bg-green-600 p-2 md:p-4 text-center">
//     <p>{message}</p>
//     <button
//       onClick={onClose}
//       className="absolute text-2xl top-1 right-2 text-white hover:text-gray-300">
//       <CgClose />
//     </button>
//   </div>
// );

// const Web3WalletConnect = () => {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [walletBalance, setWalletBalance] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showInstallMetamaskPopup, setShowInstallMetamaskPopup] =
//     useState(false);
//   const [copyButtonText, setCopyButtonText] = useState("Copy Link");

//   const CORE_TESTNET_CHAIN_ID = "0x45b";

//   const fetchBalance = useCallback(async () => {
//     if (!provider || !walletAddress) {
//       console.error("Provider or wallet address is not set");
//       return;
//     }

//     try {
//       const balance = await provider.getBalance(walletAddress);
//       const balanceInCore = ethers.formatEther(balance);
//       setWalletBalance(`${balanceInCore} CORE`);
//     } catch (error) {
//       console.error("Error fetching balance:", error);
//       setErrorMessage("Error fetching balance. Please try again.");
//     }
//   }, [provider, walletAddress]);

//   useEffect(() => {
//     if (provider && walletAddress) {
//       fetchBalance();
//     }
//   }, [provider, walletAddress, fetchBalance]);

//   const switchToCoreTestnet = async () => {
//     try {
//       await window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: CORE_TESTNET_CHAIN_ID }],
//       });
//     } catch (switchError) {
//       if (switchError.code === 4902) {
//         try {
//           await window.ethereum.request({
//             method: "wallet_addEthereumChain",
//             params: [
//               {
//                 chainId: CORE_TESTNET_CHAIN_ID,
//                 chainName: "Core Testnet",
//                 nativeCurrency: {
//                   name: "tCore",
//                   symbol: "tCORE",
//                   decimals: 18,
//                 },
//                 rpcUrls: ["https://rpc.test.btcs.network"],
//                 blockExplorerUrls: ["https://scan.test.btcs.network"],
//               },
//             ],
//           });
//         } catch (addError) {
//           console.error("Error adding Core Testnet:", addError);
//           setErrorMessage(
//             "Failed to add Core Testnet. Please add it manually."
//           );
//         }
//       } else {
//         console.error("Error switching to Core Testnet:", switchError);
//         setErrorMessage(
//           "Failed to switch to Core Testnet. Please switch manually."
//         );
//       }
//     }
//   };

//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         const web3Provider = new ethers.BrowserProvider(window.ethereum);
//         await web3Provider.send("eth_requestAccounts", []);

//         const network = await web3Provider.getNetwork();

//         if (network.chainId.toString(16) !== CORE_TESTNET_CHAIN_ID.slice(2)) {
//           await switchToCoreTestnet();
//           const updatedProvider = new ethers.BrowserProvider(window.ethereum);
//           setProvider(updatedProvider);
//         } else {
//           setProvider(web3Provider);
//         }

//         const walletSigner = await web3Provider.getSigner();
//         setSigner(walletSigner);

//         const address = await walletSigner.getAddress();
//         setWalletAddress(address);
//         console.log("Wallet Address:", address);
//       } else {
//         setShowInstallMetamaskPopup(true);
//       }
//     } catch (error) {
//       console.error("Error connecting to wallet:", error);
//       setErrorMessage("Error connecting to wallet. Please try again.");
//     }
//   };

//   const disconnectWallet = () => {
//     setProvider(null);
//     setSigner(null);
//     setWalletAddress("");
//     setWalletBalance("");
//     console.log("wallet Disconnected!");
//   };

//   const trimWalletAddress = (address) => {
//     return `${address.slice(0, 5)}...${address.slice(-5)}`;
//   };

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText("https://chaintrail.vercel.app");
//     setCopyButtonText("Copied");
//     setTimeout(() => setCopyButtonText("Copy Link"), 2000);
//   };

//   return (
//     <div className="bg-neutral-900 rounded-lg my-6 p-5">
//       {errorMessage && (
//         <ErrorMessage
//           message={errorMessage}
//           onClose={() => setErrorMessage("")}
//         />
//       )}
//       <div className="container mx-auto text-center bg-neutral-800 p-6 rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold mb-4">Connect Your Core Wallet</h1>
//         <p>
//           Only Core Testnet is supported. You will be prompted to switch if
//           necessary.
//         </p>
//         {!walletAddress ? (
//           <div>
//             <Button
//               className="mt-4 bg-gold-500 text-black text-xs hover:bg-yellow-600"
//               onClick={connectWallet}>
//               Connect Wallet
//             </Button>
//           </div>
//         ) : (
//           <div>
//             <p className="mt-4">{`Connected: ${trimWalletAddress(
//               walletAddress
//             )}`}</p>
//             <p className="mt-2">{`Balance: ${walletBalance}`}</p>
//             <Button
//               className="mt-4 bg-red-500 text-black text-xs hover:bg-red-600"
//               onClick={disconnectWallet}>
//               Disconnect
//             </Button>
//           </div>
//         )}
//       </div>
//       {showInstallMetamaskPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-slate-950 rounded-lg shadow-xl p-4 w-80 relative">
//             <button
//               onClick={() => setShowInstallMetamaskPopup(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
//               <CgClose />
//             </button>
//             <p className="text-white text-center mb-4">
//               Copy this link and open in your MetaMask
//             </p>
//             <div className="flex justify-center">
//               <Button
//                 onClick={handleCopyLink}
//                 className="flex items-center gap-1 border border-white bg-black hover:border-gold-500 text-xs">
//                 <IoCopy /> {copyButtonText}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//       <div id="nftContainer" className="mt-4"></div>
//     </div>
//   );
// };

// export default Web3WalletConnect;

import { useState, useEffect } from "react";
import { Web3Modal } from "@web3modal/standalone";
import { ethers } from "ethers";
import Button from "../components/Reusable/Button";

const Web3WalletConnect = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [chainId, setChainId] = useState(null);

  const CORE_MAINNET_CHAIN_ID = 1116;
  const CORE_TESTNET_CHAIN_ID = 1115;

  useEffect(() => {
    const modal = new Web3Modal({
      projectId: "24911ae43d4f2f85e9408da2d8c99868",
      standaloneChains: [
        `eip155:${CORE_MAINNET_CHAIN_ID}`,
        `eip155:${CORE_TESTNET_CHAIN_ID}`,
      ],
      defaultChain: CORE_TESTNET_CHAIN_ID,
    });
    setWeb3Modal(modal);
  }, []);

  const connectWallet = async () => {
    try {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      let newProvider;

      if (isMobile) {
        newProvider = await web3Modal.openModal();
        await newProvider.enable();
      } else {
        if (typeof window.ethereum !== "undefined") {
          newProvider = new ethers.BrowserProvider(window.ethereum);
          await newProvider.send("eth_requestAccounts", []);
        } else {
          newProvider = await web3Modal.openModal();
          await newProvider.enable();
        }
      }

      setProvider(newProvider);

      const signer = await newProvider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);

      // Get and set the current chain ID
      const network = await newProvider.getNetwork();
      setChainId(network.chainId);

      // Add event listener for chain changes
      window.ethereum.on("chainChanged", handleChainChanged);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    if (provider) {
      if (provider.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      setProvider(null);
      setAddress(null);
      setChainId(null);

      // Remove event listener
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    }
  };

  const handleChainChanged = (newChainId) => {
    // Convert newChainId from hex to decimal
    const chainId = parseInt(newChainId, 16);
    setChainId(chainId);

    // Check if the new chain is supported
    if (
      chainId !== CORE_MAINNET_CHAIN_ID &&
      chainId !== CORE_TESTNET_CHAIN_ID
    ) {
      alert("Please switch to Core Mainnet or Core Testnet");
    }
  };

  const switchNetwork = async (targetChainId) => {
    if (!provider) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName:
                  targetChainId === CORE_MAINNET_CHAIN_ID
                    ? "Core Mainnet"
                    : "Core Testnet",
                nativeCurrency: {
                  name: "CORE",
                  symbol: "CORE",
                  decimals: 18,
                },
                rpcUrls: [
                  targetChainId === CORE_MAINNET_CHAIN_ID
                    ? "https://rpc.coredao.org"
                    : "https://rpc.test.btcs.network",
                ],
                blockExplorerUrls: [
                  targetChainId === CORE_MAINNET_CHAIN_ID
                    ? "https://scan.coredao.org"
                    : "https://scan.test.btcs.network",
                ],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Core network:", addError);
        }
      }
      console.error("Error switching to Core network:", switchError);
    }
  };

  return (
    <div className="bg-neutral-900 p-4 rounded-lg my-4 leading-10">
      {!address ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div>
          <p>Connected Address: {address}</p>
          <p>Current Chain ID: {chainId}</p>
          <Button onClick={() => switchNetwork(CORE_MAINNET_CHAIN_ID)}>
            Switch to Core Mainnet
          </Button>
          <Button onClick={() => switchNetwork(CORE_TESTNET_CHAIN_ID)}>
            Switch to Core Testnet
          </Button>
          <Button onClick={disconnectWallet}>Disconnect Wallet</Button>
        </div>
      )}
    </div>
  );
};

export default Web3WalletConnect;
