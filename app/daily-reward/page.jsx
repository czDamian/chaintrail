import { BsCalendar2Date } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import SideNav from "../components/Reusable/SideNav";
import ClaimDailyReward from "./ClaimDailyReward";
import FetchPoints from "../components/user/FetchPoints";
import FetchPass from "../components/user/FetchPass";

export const metadata = {
  title: "Daily Rewards",
  description: "Earn NFTs while playing your favorite game",
};

const DailyReward = () => {
  return (
    <section>
      <div>
        <div className="flex justify-between w-full items-center px-6">
          <h1 className="my-4">EARN MORE REWARDS!</h1>
          <SideNav />
        </div>
        <div className="flex mt-10 items-center justify-between gap-2  rounded-md mx-4">
          <div className=" flex flex-col items-center flex-shrink-0justify-center gap-4 w-24 h-28 md:w-32 md:w-30 p-3 rounded-xl bg-neutral-700 text-yellow-500 hover:bg-neutral-950 cursor-pointer">
            <BsCalendar2Date className="text-3xl " />
            <p className="text-[12px]">Daily Reward</p>
          </div>
          <div className=" flex flex-col items-center justify-center gap-8w-24 h-28 md:w-32 md:w-30 p-3 rounded-xl bg-neutral-700 hover:bg-neutral-950 cursor-pointer">
            <FaTasks className="text-3xl " />
            <p className="text-sm">Daily Tasks</p>
          </div>
          <div className=" flex flex-col items-center justify-center gap-8 w-24 h-28 md:w-32 md:w-30 p-3 rounded-xl bg-neutral-700 hover:bg-neutral-950 cursor-pointer">
            <img src="challengeIcon.svg" alt="daily challenge" />
            <p className="text-sm">Challenges</p>
          </div>
        </div>
      </div>
      <div className="mx-auto flex flex-col items-center justify-between">
        <div className="flex gap-2">
          <FetchPoints />
          <FetchPass />
        </div>
        <ClaimDailyReward />
      </div>
    </section>
  );
};
export default DailyReward;
