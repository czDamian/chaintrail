"use client";
import React from "react";

// Mapping network names to their base currencies
const networkCurrencies = {
  sepolia: "ETH",
  mainnet: "ETH",
};

const trimAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const WalletDetails = ({ walletAddress, chainName, balance }) => {
  // Determine the currency based on the chain name
  const baseCurrency = networkCurrencies[chainName.toLowerCase()] || "ETH";

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold mb-4">Wallet Details</h2>
      <div className="p-4 border rounded-md shadow-md w-full max-w-lg text-center">
        <p className="text-lg font-semibold">Wallet Address:</p>
        <p className="text-gray-600">{trimAddress(walletAddress)}</p>
        <p className="text-lg font-semibold">Chain Name:</p>
        <p className="text-gray-600 uppercase">{chainName}</p>
        <p className="text-lg font-semibold">Balance:</p>
        <p className="text-gray-600">
          {balance} {baseCurrency}
        </p>
      </div>
    </div>
  );
};

export default WalletDetails;
