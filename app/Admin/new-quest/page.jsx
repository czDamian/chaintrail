import CreateQuest from './CreateQuest';

export const metadata = {
  title: "Create Quest",
  description: "Earn NFTs while playing your favorite game",
};

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <CreateQuest />
    </div>
  );
}
