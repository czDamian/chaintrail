import Image from "next/image";

export const QuestUI = () => {
  return (
    <div className="fixed inset-0 -z-30 flex items-center justify-center bg-black font-bold text-lg">
      <div className="relative w-screen h-screen">
        <Image
          src="/btn/success.png"
          alt="success background"
          width={1000}
          height={1000}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center"></div>
      </div>
    </div>
  );
};

export default QuestUI;
