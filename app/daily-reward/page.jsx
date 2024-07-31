import { BsCalendar2Date } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import Button from "../components/Reusable/Button";
import SideNav from "../components/Reusable/SideNav";
import ClaimDailyPass from "./ClaimDailyPass";
import ClaimDailyReward from "./ClaimDailyReward";
import FetchPoints from "../components/user/FetchPoints";
<<<<<<< HEAD
=======

>>>>>>> 2e8ff52d36ba331a1a34e519a4a420337e758db4

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
<<<<<<< HEAD
          <div className=" flex flex-col items-center justify-center flex-shrink-0justify-center gap-8 w-24 h-28 md:w-32 md:w-30 p-3 rounded-xl bg-neutral-700 text-yellow-500 hover:bg-neutral-950 cursor-pointer">
=======
          <div className=" flex flex-col items-center flex-shrink-0justify-center gap-8 w-32 h-30 py-3 rounded-xl bg-neutral-700 text-yellow-500 hover:bg-neutral-950 cursor-pointer">
>>>>>>> 2e8ff52d36ba331a1a34e519a4a420337e758db4
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
<<<<<<< HEAD
      <div className="mx-auto flex flex-col items-center justify-between">
        <FetchPoints />
        <ClaimDailyPass />
        <ClaimDailyReward />
      </div>
=======
      <FetchPoints />
      <ClaimDailyPass />
      <ClaimDailyReward />
>>>>>>> 2e8ff52d36ba331a1a34e519a4a420337e758db4
      <DailyBonus />
    </section>
  );
};
export default DailyReward;

const DailyBonus = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">DAILY BONUS</h1>
          <p className="text-sm mb-6">
            Free Coins for logging into the game daily without skipping
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex bg-neutral-900 py-6 flex-col border border-neutral-500 rounded-lg items-center">
            <img
              src="/coins.png"
              alt="Chain Points"
              className="w-12 h-12 mb-2"
            />
            <span className="text-xl mb-2 font-bold">+1200</span>
            <span className="text-sm">Chain Points</span>
          </div>
          <div className="flex bg-neutral-900 py-6 flex-col border border-neutral-500 rounded-lg items-center">
            <img
              src="/ticketIcon.svg"
              alt="Play Passes"
              className="w-12 h-12 mb-2"
            />
            <span className="text-xl font-bold">4</span>
            <span className="text-sm mb-2">Play Passes</span>
          </div>
        </div>
        <div className="text-center">
          <Button className="px-20 py-2 bg-yellow-500 hover:bg-yellow-400 active:scale-105 text-black font-bold rounded-md">
            CLAIM
          </Button>
        </div>
      </div>
    </div>
  );
};
