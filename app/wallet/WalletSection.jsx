import { useState } from "react";
import ConnectedWallet from "./ConnectedWallet";
import ImportWallet from "./ImportWallet";

export default function WalletSection({ userInfo, fetchUserInfo }) {
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importMethod, setImportMethod] = useState(null);

  const handleConnectWallet = () => {
    setShowImportOptions(true);
  };

  const handleCancel = () => {
    setShowImportOptions(false);
    setImportMethod(null);
  };

  return (
    <div className="col-span-2">
      {userInfo.walletAddress && userInfo.privateKey ? (
        <ConnectedWallet
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
        />
      ) : (
        <>
          {!showImportOptions ? (
            <button
              onClick={handleConnectWallet}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full">
              Connect Wallet
            </button>
          ) : !importMethod ? (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setImportMethod("seedPhrase")}
                className="bg-green-500 text-white px-4 py-2 rounded-md">
                Import with Seed Phrase
              </button>
              <button
                onClick={() => setImportMethod("privateKey")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Import with Private Key
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
            </div>
          ) : (
            <ImportWallet
              userInfo={userInfo}
              fetchUserInfo={fetchUserInfo}
              importMethod={importMethod}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </div>
  );
}
