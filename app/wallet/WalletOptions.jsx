"use client";

const WalletOptions = ({
  importOption,
  setImportOption,
  seedPhrase,
  handleSeedPhraseChange,
  connectWallet,
}) => (
  <div className="mb-6 flex justify-between flex-wrap gap-2 items-center">
    <button
      onClick={() => setImportOption("12words")}
      className={`px-4 py-2 rounded-md ${
        importOption === "12words" ? "bg-blue-800 text-white" : "bg-gray-900"
      }`}>
      Import Seed Phrase
    </button>
    {importOption === "12words" && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {seedPhrase.map((word, index) => (
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
    <button
      onClick={connectWallet}
      className="bg-green-500 w-72 text-white px-4 py-2 rounded-md mt-4">
      Import Wallet
    </button>
  </div>
);

export default WalletOptions;
