export default function UserInfo({ userInfo }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between my-4">
        <p>
          <span className="font-bold">
            <img
              src="../chaincoins.svg"
              alt="Chain Coins"
              className="w-6 h-6 inline mr-2"
            />
          </span>
          {userInfo.points}
        </p>
        <p>
          <span className="font-bold">
            <img
              src="../ticket.png"
              alt="Chain Coins"
              className="w-6 h-6 inline mr-2"
            />
          </span>
          {userInfo.playPass}
        </p>
      </div>
    </div>
  );
}
