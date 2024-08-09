import ClaimDailyReward from "./ClaimDailyReward";
import Image from "next/image";

const DailyRewardComponent = () => {
  return (
    <section>
      <div>
        <div className="flex justify-between w-full items-center px-4 my-4"></div>
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
export default DailyRewardComponent;
