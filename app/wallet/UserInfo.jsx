export default function UserInfo({ userInfo }) {
  return (
    <>
      <p>
        <span className="font-bold">Username:</span>
        {userInfo.username || " not set"}
      </p>
      <p>
        <span className="font-bold">Points:</span> {userInfo.points}
      </p>
      <p>
        <span className="font-bold">Play Pass: </span>
        {userInfo.playPass}
      </p>
    </>
  );
}
