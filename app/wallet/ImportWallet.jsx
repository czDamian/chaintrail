import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Web3 from "web3";

export default function ImportWallet({
  userInfo,
  fetchUserInfo,
  router,
  importMethod,
  onCancel,
}) {
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(""));
  const [privateKey, setPrivateKey] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);

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

  const handlePrivateKeyChange = (value) => {
    setPrivateKey(value);
  };

  const handleImportWallet = async () => {
    try {
      const web3 = new Web3("https://open-campus-codex-sepolia.drpc.org");
      let account;

      if (importMethod === "seedPhrase") {
        if (!seedPhrase.every(Boolean)) {
          setImportError("All seed phrase fields must be filled");
          return;
        }
        const mnemonic = seedPhrase.join(" ");
        account = web3.eth.accounts.privateKeyToAccount(
          web3.utils.sha3(mnemonic)
        );
      } else if (importMethod === "privateKey") {
        if (!privateKey) {
          setImportError("Private key is required");
          return;
        }
        // Ensure the private key starts with '0x'
        const formattedPrivateKey = privateKey.startsWith("0x")
          ? privateKey
          : `0x${privateKey}`;
        try {
          account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);
        } catch (error) {
          setImportError("Invalid private key format");
          return;
        }
      }

      const response = await fetch(`/api/users?userId=${userInfo.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: account.address,
          privateKey: account.privateKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user wallet info");
      }

      setImportSuccess(true);
      setImportError("");
      fetchUserInfo(userInfo.userId);
      router.refresh();
    } catch (err) {
      console.error("Error importing wallet:", err);
      setImportError(err.message || "Failed to import wallet");
      setImportSuccess(false);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold mb-4">
        Import Wallet with{" "}
        {importMethod === "seedPhrase" ? "Seed Phrase" : "Private Key"}
      </h3>
      {importMethod === "seedPhrase" ? (
        <div className="grid grid-cols-3 gap-2">
          {seedPhrase.map((word, index) => (
            <input
              key={index}
              type="text"
              value={word}
              onChange={(e) => handleSeedPhraseChange(index, e.target.value)}
              className="border rounded-md outline-none focus:border-gray-200 p-2 text-sm"
              placeholder={`Word ${index + 1}`}
            />
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={privateKey}
          onChange={(e) => handlePrivateKeyChange(e.target.value)}
          className="w-full border rounded-md outline-none focus:border-gray-200 p-2 text-sm"
          placeholder="Enter your private key"
        />
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md">
          Cancel
        </button>
        <button
          onClick={handleImportWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Import Wallet
        </button>
      </div>
      {importSuccess && (
        <div className="flex items-center mt-2 text-green-600">
          <FaCheckCircle className="mr-2" />
          <p>Wallet imported successfully!</p>
        </div>
      )}
      {importError && (
        <div className="text-sm text-red-600 mt-2">
          <p>{importError}</p>
        </div>
      )}
    </>
  );
}
