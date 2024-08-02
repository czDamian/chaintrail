import SideNav from "../components/Reusable/SideNav";
import Web3WalletConnect from "../wallet/ConnectWallet";

export const metadata = {
  title: "My Collections",
  description: "Earn NFTs while playing your favorite game",
};

const images = [
  {
    img1: "mainNft1.svg",
    scan: "scanNft.svg",
  },
  {
    img2: "mainNft2.svg",
    scan: "scanNft.svg",
  },
  {
    img3: "mainNft3.svg",
    scan: "scanNft.svg",
  },
];

const Collection = () => {
  return (
    <div className="my-6 w-full">
      <div className="flex justify-between items-center text-black bg-gold-500 gap-8 rounded mb-4">
        <h1 className="my-4 px-4">MY COLLECTIONS</h1>
        <SideNav />
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
        {images.map((item, index) => (
          <div key={index}>
            <div className="rounded-xl overflow-hidden">
              {Object.keys(item).map((key, idx) => (
                <img
                  loading="lazy"
                  key={idx}
                  src={item[key]}
                  alt={key}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        ))}
      </div> */}
      <p className="mt-16 px-4 md:px-8">Only NFTs minted on Core will be displayed here</p>
      <Web3WalletConnect />
    </div>
  );
};
export default Collection;
