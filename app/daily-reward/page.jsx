import ClaimDailyReward from "./ClaimDailyReward";
import FetchPoints from "../components/user/FetchPoints";
import FetchPass from "../components/user/FetchPass";
import Image from "next/image";
import BackButton from "../components/Reusable/BackButton";

export const metadata = {
  title: "Claim Daily Rewards",
  description: "Earn NFTs while playing your favorite game",
};

const DailyReward = () => {
  return (
    <section>
      <div>
        <div className="flex justify-between w-full items-center px-4 my-4">
          <FetchPoints />
          <FetchPass />
          <BackButton />
        </div>
      </div>
      <div className="mx-auto flex flex-col items-center justify-between my-10">
        <Image
          src="/coinbag.png"
          width={100}
          height={100}
          alt="coins"
          className="mx-auto"
        />
        <ClaimDailyReward />
      </div>
    </section>
  );
};
export default DailyReward;
