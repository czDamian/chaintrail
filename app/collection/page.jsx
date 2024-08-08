import SideNav from "../components/Reusable/SideNav";
import FetchNFT from "./FetchNft";
import FetchUserNFTs from "./FetchUserNFTs";

export const metadata = {
  title: "My Collections",
  description: "Earn NFTs while playing your favorite game",
};

const Collection = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-black bg-gold-500 gap-8 rounded mb-4">
        <h1 className="my-4 px-4">MY COLLECTIONS</h1>
      </div>
      <FetchNFT />
      <FetchUserNFTs />
      <SideNav />
    </div>
  );
};
export default Collection;
