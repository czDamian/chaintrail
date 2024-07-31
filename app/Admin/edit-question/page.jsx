import EditQuestion from './EditQuestion';

export const metadata = {
  title: "Edit Question",
  description: "Earn NFTs while playing your favorite game",
};

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <EditQuestion />
    </div>
  );
}
