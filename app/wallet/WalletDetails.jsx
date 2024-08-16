"use client";
import React from "react";
import { FaCaretDown } from "react-icons/fa";

const networkCurrencies = {
  sepolia: "ETH",
  mainnet: "ETH",
};

const trimAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const trimBalance = (balance) => {
  if (!balance) return "";
  const formattedBalance = parseFloat(balance).toFixed(3);
  return formattedBalance;
};

const WalletDetails = ({
  walletAddress,
  chainName,
  balance,
  setSelectedNetwork,
  handleDisconnect,
  setShowNetworkModal,
}) => {
  const baseCurrency = networkCurrencies[chainName.toLowerCase()] || "ETH";

  return (
    <div className="flex flex-row items-center justify-between gap-4 text-xs">
      <p
        className="text-gray-600 flex gap-4 border rounded-md p-2 items-center cursor-pointer"
        onClick={() => handleDisconnect()}>
        <span className="text-gray-300">
          {trimBalance(balance)} {baseCurrency}
        </span>
        <span className="flex items-center">
          <img
            src="networks/eth.png"
            width={30}
            height={30}
            alt="network"
            className="w-6"
          />
          <span className="flex items-center">
            {trimAddress(walletAddress)}
            <FaCaretDown className="ml-2" />
          </span>
        </span>
      </p>
      <div
        className="text-gray-600 border rounded-md p-2 flex items-center gap-2 uppercase cursor-pointer"
        onClick={() => setShowNetworkModal(true)}>
        <img
          src="networks/eth.png"
          width={30}
          height={30}
          alt="network"
          className="w-6"
        />
        <span className="flex items-center">
          {chainName}
          <FaCaretDown className="ml-2" />
        </span>
      </div>
    </div>
  );
};

export default WalletDetails;
