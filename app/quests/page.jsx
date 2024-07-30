import FetchQuestsFromDb from "./FetchQuests";

export const metadata = {
  title: "Quest List",
  description: "Earn NFTs while playing your favorite game",
};

const Play = () => {
  return (
    <div>
      <FetchQuestsFromDb />
    </div>
  );
};

export default Play;
