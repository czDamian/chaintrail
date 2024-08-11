"use client";
import React from "react";

const NetworkSwitcher = ({ selectedNetwork, setSelectedNetwork }) => {
  const networks = [
    {
      name: "Ethereum Mainnet",
      rpcUrl: "https://eth-mainnet.public.blastapi.io",
    },
    { name: "Sepolia Testnet", rpcUrl: "https://rpc.sepolia.org" },
  ];

  return (
    <select
      value={selectedNetwork}
      onChange={(e) => setSelectedNetwork(e.target.value)}
      className="border p-2 rounded-md">
      {networks.map((network) => (
        <option key={network.name} value={network.rpcUrl}>
          {network.name}
        </option>
      ))}
    </select>
  );
};

export default NetworkSwitcher;
