import SideNav from "../components/Reusable/SideNav";
import Referrals from "./Referrals";
import UserProfile from "./UserProfile";

export const metadata = {
  title: "Wallet",
  description: "Earn NFTs while playing your favorite game",
};

const Wallet = () => {
  return (
    <div>
      <UserProfile />
      <Referrals />
      <SideNav />
    </div>
  );
};
export default Wallet;
