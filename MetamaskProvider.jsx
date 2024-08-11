"use client";
import { MetaMaskProvider } from "@metamask/sdk-react";

const MetaMaskWrapper = ({ children }) => {
  return (
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: { name: "ChainTrail" },
        walletConnect: {
          projectId: "24911ae43d4f2f85e9408da2d8c99868",
        },
        // Public RPC URLs
        rpc: {
          1: "https://rpc.ankr.com/eth", // Ethereum Mainnet
          137: "https://rpc.ankr.com/polygon", // Polygon Mainnet
        },
      }}>
      {children}
    </MetaMaskProvider>
  );
};

export default MetaMaskWrapper;
