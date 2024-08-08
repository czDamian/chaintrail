import SideNav from "../components/Reusable/SideNav";
import Web3WalletConnect from "../wallet/ConnectWallet";

export const metadata = {
  title: "My Collections",
  description: "Earn NFTs while playing your favorite game",
};


const Collection = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-black bg-gold-500 gap-8 rounded mb-4">
        <h1 className="my-4 px-4">MY COLLECTIONS</h1>
        <SideNav />
      </div>

      <p className="mt-10 px-4 md:px-8">
        Only NFTs minted on Core will be displayed here
      </p>
      <Web3WalletConnect />
    </div>
  );
};
export default Collection;
