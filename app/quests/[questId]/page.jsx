import QuestionComponent from "./Questions";


export const metadata = {
  title: "Quest",
  description: "Earn NFTs while playing your favorite game",
};
const QuestPage = ({ params }) => {
  const { questId } = params; // Extract questId from URL

  return <QuestionComponent questId={questId} />;
};

export default QuestPage;
