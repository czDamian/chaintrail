import BackButton from "@/app/components/Reusable/BackButton";
const UserInfoBar = ({
  points,
  currentQuestionIndex,
  totalQuestions,
  playPass,
}) => (
  <div className="py-2 flex justify-between items-center text-sm">

    <div className="text-xs gap-1 flex items-center">
    <BackButton />
      <span>{points}</span>
      <img src="../chaincoins.svg" alt="Chain Coins" className="w-6 h-6" />
    </div>
    <div className="flex items-center relative">
      <img src="../redImg.png" alt="level" className="w-12 h-12" />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
        {currentQuestionIndex + 1}
      </span>
    </div>
    <div className="text-xs gap-1 flex items-center">
      <span>{playPass}</span>
      <img src="../ticket.png" alt="Chain Coins" className="w-6 h-6" />
    </div>
  </div>
);

export default UserInfoBar;
