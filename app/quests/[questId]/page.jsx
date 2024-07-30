// app/quests/[questId]/page.js
import QuestionComponent from "./Question1";

const QuestPage = ({ params }) => {
  const { questId } = params; // Extract questId from URL

  return <QuestionComponent questId={questId} />;
};

export default QuestPage;
