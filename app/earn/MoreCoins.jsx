import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTelegram,
  FaLinkedin,
} from "react-icons/fa";

const MoreCoins = () => {
  const tasks = [
    { platform: "Facebook", points: 300, icon: <FaFacebook size={24} /> },
    { platform: "Twitter", points: 250, icon: <FaTwitter size={24} /> },
    { platform: "Instagram", points: 200, icon: <FaInstagram size={24} /> },
    { platform: "YouTube", points: 300, icon: <FaYoutube size={24} /> },
    { platform: "Telegram", points: 250, icon: <FaTelegram size={24} /> },
    { platform: "LinkedIn", points: 200, icon: <FaLinkedin size={24} /> },
  ];

  return (
    <section>
      <div className="">
        <h1 className="my-4 px-4">EARN MORE POINTS</h1>
        <div className="mt-10 space-y-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-neutral-800 p-4 rounded-xl">
              <div className="flex items-center">
                <div className="text-white mr-4">{task.icon}</div>
                <span className="text-white text-lg font-semibold">
                  {task.platform}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-yellow-500 text-lg font-bold">
                  +{task.points} Points
                </span>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-lg text-sm font-bold">
                  Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreCoins;
