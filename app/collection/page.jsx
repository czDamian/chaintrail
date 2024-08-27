import SideNav from "../components/Reusable/SideNav";
import FetchNFT from "./FetchNft";
import FetchUserNFTs from "./FetchUserNFTs";

export const metadata = {
  title: "My Collections",
  description: "Earn NFTs while playing your favorite game",
};

const Collection = () => {
  return (
    <div className="min-w-full mt-10">
      <FetchNFT />
      <FetchUserNFTs />
      <SideNav />
    </div>
  );
};
export default Collection;
