"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ImportWallet = () => {
  const [importOption, setImportOption] = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  const [seedPhrase, setSeedPhrase] = useState(Array(24).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSeedPhraseChange = (index, value) => {
    const updatedSeedPhrase = [...seedPhrase];
    updatedSeedPhrase[index] = value;
    setSeedPhrase(updatedSeedPhrase);

    if (index === 0) {
      const words = value.trim().split(/\s+/);
      if (words.length === 12 || words.length === 24) {
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
      let wallet;
      if (importOption === "privateKey" && privateKey) {
        wallet = new ethers.Wallet(privateKey);
      } else if (
        (importOption === "12words" &&
          seedPhrase.slice(0, 12).every(Boolean)) ||
        (importOption === "24words" && seedPhrase.every(Boolean))
      ) {
        const mnemonic = seedPhrase.join(" ");
        wallet = ethers.Wallet.fromPhrase(mnemonic);
      }

      if (wallet) {
        const provider = new ethers.JsonRpcProvider(
          "https://mainnet.eth.aragon.network"
        ); // Public node
        const balance = await provider.getBalance(wallet.address);
        console.log("Wallet Address:", wallet.address);
        console.log("Balance:", ethers.formatEther(balance));

        if (balance.gt(0)) {
          setSuccess(true);
          setError("");
        } else {
          setError("The wallet does not have any ETH.");
          setSuccess(false);
        }
      } else {
        setError("Invalid input. Please check your data.");
        setSuccess(false);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect to the wallet. Please check your input.");
      setSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      <h2 className="text-2xl font-bold mb-4">Import Wallet</h2>
      <div className=" mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setImportOption("privateKey")}
          className={`px-4 py-2 rounded-md ${
            importOption === "privateKey"
              ? "bg-blue-800 text-white"
              : "bg-gray-900"
          }`}>
          Import with Private Key
        </button>
        <button
          onClick={() => setImportOption("12words")}
          className={`px-4 py-2 rounded-md ${
            importOption === "12words"
              ? "bg-blue-800 text-white"
              : "bg-gray-900"
          }`}>
          Import 12 Words Seed Phrase
        </button>
        <button
          onClick={() => setImportOption("24words")}
          className={`px-4 py-2 rounded-md ${
            importOption === "24words"
              ? "bg-blue-800 text-white"
              : "bg-gray-900"
          }`}>
          Import 24 Words Seed Phrase
        </button>
      </div>

      {importOption === "privateKey" && (
        <textarea
          className="border p-2 rounded-md w-full max-w-lg mb-4"
          rows="4"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Paste your private key here"
        />
      )}

      {(importOption === "12words" || importOption === "24words") && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {seedPhrase
            .slice(0, importOption === "12words" ? 12 : 24)
            .map((word, index) => (
              <input
                key={index}
                type="text"
                className="border p-2 rounded-md w-32"
                value={word}
                onChange={(e) => handleSeedPhraseChange(index, e.target.value)}
                placeholder={`Word ${index + 1}`}
              />
            ))}
        </div>
      )}

      {success && (
        <div className="flex items-center w-64 space-x-2 text-green-600">
          <FaCheckCircle />
          <p>Wallet connected successfully!</p>
        </div>
      )}

      {error && (
        <div className="flex items-center w-64 space-x-2 text-red-600">
          <FaTimesCircle />
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={connectWallet}
        className="bg-green-500 w-72 text-white px-4 py-2 rounded-md mt-4">
        Import Wallet
      </button>
    </div>
  );
};

export default ImportWallet;
