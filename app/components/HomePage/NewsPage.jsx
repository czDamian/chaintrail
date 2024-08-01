import Button from "../Reusable/Button";

const NewsPage = () => {
  return (
    <div className=" p-6 max-w-xs mx-auto text-center">
      <h1 className=" text-3xl md:text-4xl font-bold mb-4">NEWS</h1>
      <div className="p-3 bg-dark-900 rounded-xl">
        <h3 className="text-lg font-bold mb-2">
          NPC LABS RAISES $18M TO IMPROVE WEB3 GAMING
        </h3>
        <p className="text-sm mt-10 text-center text-gold-500 mb-4">
          Source: crypto.news
        </p>
        <p className="text-sm text-gray-300 leading-6 mb-6">
          The funds raised will be used to enhance the B3.fun ecosystem, making
          it easier for non-Web3 users to discover and engage with crypto games.
          NPC Labs is building discovery portals like Basement.fun to facilitate
          this p...
        </p>
        <Button className="text-black text-xs md:text-sm bg-gold-500">
          READ MORE
        </Button>
      </div>
    </div>
  );
};

export default NewsPage;
