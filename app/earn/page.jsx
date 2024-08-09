import SideNav from "../components/Reusable/SideNav";
import DailyRewardComponent from "./DailyRewardComponent";
import Referrals from "./Referrals";

export const metadata = {
  title: "Earn",
  description: "Earn NFTs while playing your favorite game",
};

const Wallet = () => {
  return (
    <div>
      <div className="flex flex-col gap-20">
        <DailyRewardComponent />
        <Referrals />
      </div>
      <SideNav />
    </div>
  );
};
export default Wallet;
