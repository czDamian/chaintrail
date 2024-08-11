"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { FaCheckCircle } from "react-icons/fa";
import WalletOptions from "./WalletOptions";
import WalletDetails from "./WalletDetails";
import DisconnectButton from "./DisconnectButton";
import NetworkSwitcher from "./NetworkSwitcher ";

const ImportWallet = () => {
  const [importOption, setImportOption] = useState("12words");
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(""));
  const [wallet, setWallet] = useState(null);
  const [chainName, setChainName] = useState("");
  const [balance, setBalance] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(
    "https://rpc.sepolia.org"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (wallet) {
        try {
          const provider = new ethers.JsonRpcProvider(selectedNetwork);
          const balance = await provider.getBalance(wallet.address);
          const network = await provider.getNetwork();
          setChainName(network.name);
          setBalance(ethers.formatEther(balance));
        } catch (err) {
          console.error("Error fetching wallet details:", err);
        }
      }
    };

    fetchWalletDetails();
  }, [wallet, selectedNetwork]);

  const handleSeedPhraseChange = (index, value) => {
    const updatedSeedPhrase = [...seedPhrase];
    updatedSeedPhrase[index] = value;
    setSeedPhrase(updatedSeedPhrase);

    if (index === 0) {
      const words = value.trim().split(/\s+/);
      if (words.length === 12) {
        for (let i = 0; i < words.length; i++) {
          if (i < seedPhrase.length) {
            updatedSeedPhrase[i] = words[i];
          }
        }
        setSeedPhrase(updatedSeedPhrase);
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (importOption === "12words" && seedPhrase.every(Boolean)) {
        const mnemonic = seedPhrase.join(" ");
        const walletInstance = ethers.Wallet.fromPhrase(mnemonic); // Correct method for ethers v6
        setWallet(walletInstance);
        setSuccess(true);
        setError("");
      } else {
        setError("FIelds cannot be empty");
        setSuccess(false);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to import wallet");
      setSuccess(false);
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    setChainName("");
    setBalance(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      {wallet ? (
        <>
          <WalletDetails
            walletAddress={wallet.address}
            chainName={chainName}
            balance={balance}
          />
          <NetworkSwitcher
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
          />
          <DisconnectButton onDisconnect={handleDisconnect} />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Import Wallet</h2>
          <WalletOptions
            importOption={importOption}
            setImportOption={setImportOption}
            seedPhrase={seedPhrase}
            handleSeedPhraseChange={handleSeedPhraseChange}
            connectWallet={connectWallet}
          />
          {success && (
            <div className="flex items-center w-64 space-x-2 text-green-600">
              <FaCheckCircle />
              <p>Wallet connected successfully!</p>
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600">
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImportWallet;
