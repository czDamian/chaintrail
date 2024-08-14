const UserInfoBar = ({
  points,
  currentQuestionIndex,
  totalQuestions,
  playPass,
}) => (
  <div className="py-2 flex justify-between items-center text-sm">
    <div className="text-xs gap-1 flex items-center">
      <img src="../chaincoins.svg" alt="Chain Coins" className="w-6 h-6" />
      <span>{points}</span>
    </div>
    <div className="flex items-center">
      <img src="../redImg.png" alt="level" className="w-12 h-11" />
      <span className="relative text-xs -ml-7 mt-1 font-bold">
        {currentQuestionIndex + 1}/{totalQuestions}
      </span>
    </div>
    <div className="text-xs gap-1 flex items-center">
      <img src="../ticket.png" alt="Chain Coins" className="w-6 h-6" />
      <span>{playPass}</span>
    </div>
  </div>
);

export default UserInfoBar;
