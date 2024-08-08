
import CreateQuestQuestion from './CreateQuestQuestions';


export const metadata = {
  title: "Add Question",
  description: "Earn NFTs while playing your favorite game",
};

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <CreateQuestQuestion />
    </div>
  );
}
