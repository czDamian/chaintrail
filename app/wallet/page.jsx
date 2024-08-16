import SideNav from "../components/Reusable/SideNav";
import UserProfile from "./UserProfile";

export const metadata = {
  title: "Wallet",
  description: "Earn NFTs while playing your favorite game",
};

const Wallet = () => {
  return (
    <div>
      <div className="mb-20">
        <div className="my-20"></div>
        <UserProfile />
      </div>
      <SideNav />
    </div>
  );
};
export default Wallet;
